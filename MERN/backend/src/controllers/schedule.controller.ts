// Libraries
const { Op } = require("sequelize");
const fs = require("fs");
const bcryptjs = require("bcryptjs");
import { Request, Response } from "express";

// Models
import { users, groups, schedules, groupsAttributes, usersAttributes, schedulesAttributes } from "../models/init-models";

// Functions
import console_log from "../logging/console_log";
import { concatTags } from "../functions/tag.functions";
import { getDateUTC, getTimeUTC, floorTime } from "../functions/date.functions";
import { storePasscodes, getPerformerPasscodes, generatePasscodes } from "../functions/passcode.functions";

interface scheduleAPI {
    scheduleConcert(req: Request, res: Response): Promise<void>;
    getSchedule(req: Request, res: Response): Promise<void>;
    prepareConcert(req: Request, res: Response): Promise<void>;
}

class ScheduleController implements scheduleAPI {
    // IMPORTANT: HAVE NOT TESTED IF THE CHECK FOR TIME SLOT RESERVATION WORKS.
    // IMPORTANT: DOES NOT REQUIRE EMAIL VERIFICATION CURRENTLY.
    async scheduleConcert(req: Request, res: Response) {
        console_log("Scheduling concert. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        const { concertTitle, concertTags, concertDescription, date, time, username, password } = req.body;
        const tags: string = concatTags(concertTags);

        //TODO: Validate requested Date and Time and reject if invalid format, or in the past.

        // Check if timeslot is taken.
        schedules.findOne({
            where: {
                Date: { [Op.eq]: date },
                Time: { [Op.eq]: floorTime(time) }
            }
        }).then((schedule) => {
            console_log("\nSchedule: ", schedule, "\n");
            if (schedule) { throw new Error("This date and time has already been reserved."); }

            // Find user who requested the schedule.
            let user: usersAttributes | undefined = undefined;
            users.findAll({
                attributes: { exclude: ['VerificationCode'] },
                where: { UserName: { [Op.eq]: username } }
            }).then((users) => {
                let first: users | undefined = users.at(0);
                if (users.length > 1) { console_log("Warning: Multiple users with same username and password detected.\n"); }
                bcryptjs.compare(password, users[0].Password, (e: any, equal: any) => {
                    if (e) { return res.status(401).json({ error: e.message }); }
                    else if (!equal) { return res.status(401).json({ error: "Incorrect password." }); }
                });
                if (!first) { throw new Error("User not found.") }
                user = first.dataValues;
                // if (user.IsVerified != 0) { throw new Error("Please verify email befoer scheduling.") } // Add back once email verification works.

                // Create the group.
                let newGroup: groupsAttributes;
                let newSchedule: schedulesAttributes;
                groups.create({
                    GroupLeaderID: user.ID,
                    GroupLeaderName: user.Name,
                    Title: concertTitle,
                    Tags: tags,
                    Description: concertDescription,
                    Date: date,
                    Time: floorTime(time)
                }).then((group) => {
                    newGroup = group.dataValues;

                    // Schedule the recording.
                    const passcodes: number[] = generatePasscodes(5);
                    schedules.create({
                        GroupID: newGroup.GroupID,
                        Date: newGroup["Date"],
                        Time: newGroup["Time"],
                        MaestroPasscode: passcodes.at(0),
                        User1Passcode: passcodes.at(1),
                        User2Passcode: passcodes.at(2),
                        User3Passcode: passcodes.at(3),
                        User4Passcode: passcodes.at(4)
                    }).then((schedule) => {
                        newSchedule = schedule.dataValues;

                        console_log("New schedule: ", newSchedule, "\n");
                        return res.status(200).send({ group: newGroup, schedule: newSchedule });
                    }).catch((e) => { error(e); });
                }).catch((e) => { error(e); });
            }).catch((e) => { error(e); });
        }).catch((e) => { error(e); });

        function error(e: any) {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        }
    }

    async getSchedule(req: Request, res: Response) {
        const date = typeof req.query.date === "string" ? req.query.date : "";
        // TODO: Verify date format YYYY-MM-DD and reject if invalid.

        let schedule: Set<string> = new Set();
        await schedules.findAll(
            {
                attributes: ["Time"],
                where: { Date: { [Op.eq]: date } }
            }).then((scheduled) => {
                scheduled.forEach((scheduleData) => {
                    let time: string | undefined = scheduleData.dataValues.Time;
                    if (time) { schedule.add(time); }
                })

                console_log("Scheduled times: ", schedule, "\n\n");
                return res.status(200).send({ scheduledTimes: Array.from(schedule) });
            }).catch((e) => {
                console_log("Error: ", e.message, "\n\n");
                return res.status(500).send({ error: e.message });
            });
    }

    async prepareConcert(req: Request, res: Response) {
        console_log("Preparing concert. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        let { maestroPasscode } = req.body;

        // Get currently scheduled recording and validate if user is the maestro.
        let currentDate: string = getDateUTC();
        let currentTime: string = getTimeUTC();

        // Authenticate user.
        await schedules.findAll({
            where: {
                Date: {
                    [Op.eq]: currentDate
                },
                Time: {
                    [Op.between]: [floorTime(currentTime), currentTime]
                }
            }
        }).then((schedules) => {
            let firstSchedule: schedules | undefined = schedules.at(0);
            if (schedules.length > 1) {
                console_log("Warning: Multiple schedules with same time detected.\n");
            }
            if (!firstSchedule) {
                throw new Error("No concert found scheduled for the current time slot.");
            }
            else if (parseInt(maestroPasscode) != firstSchedule.MaestroPasscode) {
                throw new Error("Maestro passcode does not match that of the currently scheduled recording.");
            }

            // Save passcodes to files for the socket server to check.
            storePasscodes(getPerformerPasscodes(firstSchedule));
            fs.writeFile("./temp/groupId", firstSchedule.GroupID?.toString(), (e: any) => {
                if (e) { throw new Error("Saving groupId file failed."); }
            });

            console_log("Passcodes saved to files.\n");
            return res.status(200).send({ message: "No errors caught. Passcodes saved to files." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }
}

export default ScheduleController;
