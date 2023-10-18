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
    validatePerformer(req: Request, res: Response): Promise<void>;
    getNextConcert(req: Request, res: Response): Promise<void>;
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

        // TODO: Validate requested Date and Time and reject if invalid format, or in the past.

        // Check if timeslot is taken.
        schedules.findOne({
            where: {
                Date: { [Op.eq]: date },
                Time: { [Op.eq]: floorTime(time) }
            }
        }).then((schedule) => {
            // TODO: Might be improved by makeing date time pair unique in groups, meaning no search or check needed.
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
                if (!first) { throw new Error("User not found.") }
                user = first.dataValues;
                // if (user.IsVerified != 0) { throw new Error("Please verify email befoer scheduling.") } // Add back once email verification works.

                bcryptjs.compare(password, user.Password).then((result: any) => {
                    if (!result) { throw new Error("Incorrect password."); }

                    // Create the group.
                    let newGroup: groupsAttributes;
                    let newSchedule: schedulesAttributes;
                    groups.create({
                        GroupLeaderID: user?.ID ? user.ID : 1,
                        GroupLeaderName: user?.UserName ? user.UserName : "John Cage",
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
                }).catch((e: any) => { error(e); });
            }).catch((e) => { error(e); });
        }).catch((e) => { error(e); });

        function error(e: any) {
            console_log("Error: ", e, "\n");
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

    async getNextConcert(req: Request, res: Response) {
        const date = getDateUTC();
        const time = floorTime(getTimeUTC());
        await groups.findAll(
            {
                order: [
                    ['Date', 'ASC'],
                    ['Time', 'ASC']
                ],
                where: {
                    [Op.or]:
                        [
                            {
                                Date: { [Op.eq]: date },
                                Time: { [Op.gte]: time }
                            },
                            { Date: { [Op.gt]: date } }
                        ]
                }
            }).then((group) => {
                if (!group.at(0)) { throw new Error("No future concert found.") }

                console_log("Next concert group: ", group.at(0), "\n\n");
                return res.status(200).send({ nextConcertGroup: group.at(0) });
            }).catch((e) => {
                console_log("Error: ", e.message, "\n\n");
                return res.status(500).send({ error: e.message });
            });
    }

    async prepareConcert(req: Request, res: Response) {
        console_log("Preparing concert. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        const { maestroPasscode } = req.body;

        // Get currently scheduled recording and validate if user is the maestro.
        const currentDate: string = getDateUTC();
        const currentTime: string = getTimeUTC();

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
            if (schedules.length > 1) { console_log("Warning: Multiple schedules with same time detected.\n"); }
            if (!firstSchedule) { throw new Error("No concert found scheduled for the current time slot."); }
            else if (parseInt(maestroPasscode) != firstSchedule.MaestroPasscode) { throw new Error("Maestro passcode does not match that of the currently scheduled recording."); }

            // Save passcode to file for the socket server to check.
            fs.writeFile("./temp/passcodes/" + maestroPasscode.toString(), "", (e: any) => {
                if (e) { throw new Error("Saving maestro passcode failed."); }
            });

            // Save groupId to file for socket server to read.
            fs.writeFile("./temp/groupId", firstSchedule.GroupID?.toString(), (e: any) => {
                if (e) { throw new Error("Saving groupId file failed."); }
            });

            console_log("Maestro passcode saved to file.\n");
            return res.status(200).send({ message: "No errors caught." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

    async validatePerformer(req: Request, res: Response) {
        console_log("Validating performer. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        let { performerPasscode } = req.body;

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
            if (schedules.length > 1) { console_log("Warning: Multiple schedules with same time detected.\n"); }
            if (!firstSchedule) { throw new Error("No concert found scheduled for the current time slot."); }
            if (!getPerformerPasscodes(firstSchedule).includes(parseInt(performerPasscode))) { throw new Error("Passcode not found in the currently scheduled concert."); }

            // TODO: Store file paths in config file and import everywhere.
            fs.writeFile("./temp/passcodes/" + performerPasscode.toString(), "", (e: any) => {
                if (e) { throw new Error("Saving passcode failed."); }
            });

            console_log("Passcode saved to file.\n");
            return res.status(200).send({ message: "No errors caught. Passcode saved to file." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }
}

export default ScheduleController;
