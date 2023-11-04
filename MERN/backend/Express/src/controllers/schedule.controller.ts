// Libraries
const { Op } = require("sequelize");
const fs = require("fs");
const bcryptjs = require("bcryptjs");
import { Request, Response } from "express";

// Models
import { users, groups, schedules, groupsAttributes, usersAttributes, schedulesAttributes } from "../models/init-models";

// Functions
import console_log from "../../../functions/logging/console_log";
import { concatTags } from "../functions/tag.functions";
import { getDateUTC, getTimeUTC, floorTime } from "../../../functions/date.functions";
import { getPerformerPasscodes, generatePasscodes, getListenerPasscode } from "../passcode.functions";
import { TEMP_FOLDER } from "../../config/express.config";
import { writeFileForce } from "../../../functions/file.functions";

interface scheduleAPI {
    getSchedule(req: Request, res: Response): Promise<void>;
    getNextConcert(req: Request, res: Response): Promise<void>;
    getMixMethods(req: Request, res: Response): any;

    scheduleConcert(req: Request, res: Response): Promise<void>;
    prepareConcert(req: Request, res: Response): Promise<void>;
    validatePerformer(req: Request, res: Response): Promise<void>;
    validateListener(req: Request, res: Response): Promise<void>;
}

class ScheduleController implements scheduleAPI {
    async getSchedule(req: Request, res: Response) {
        const date = typeof req.query.date === "string" ? req.query.date : "";

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

    async getMixMethods(req: Request, res: Response) {
        type MixerDescriptor = {
            fileName: string;
            displayName: string;
        }
        let mixers: MixerDescriptor[] = [];
        let mixerFiles: string[] = [];

        // REPLACE THIS STRING WITH A CONFIG VARIABLE
        try {
            mixerFiles = fs.readdirSync("../Socket/build/socketServer/Socket/src/mixers");
        }
        catch (e) {
            mixerFiles = ["Default"];
            console_log(e);
        }

        mixerFiles.forEach((file: string) => {
            let shortenedName: string | undefined = file.split(".").at(0);
            mixers.push({ fileName: file, displayName: shortenedName ? shortenedName : "Default" });
        })

        console_log("Mixers detected: ", mixers, "\n");
        return res.status(200).send({ mixers: mixers });
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

    // IMPORTANT: DOES NOT REQUIRE ACCOUNT EMAIL VERIFICATION CURRENTLY.
    async scheduleConcert(req: Request, res: Response) {
        console_log("Scheduling concert. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        const { concertTitle, concertTags, concertDescription, date, time, username, password } = req.body;
        const tags: string = concatTags(concertTags);

        // Check if timeslot is taken.
        // Date Time as a pair in MySQL should be unique.
        // That means MySQL should throw an error if the sime slot is already reserved.
        // Just in case, we also check here in this first query.
        schedules.findOne({
            where: {
                Date: { [Op.eq]: date },
                Time: { [Op.eq]: floorTime(time) }
            }
        }).then((schedule) => {
            console_log("\nSchedule: ", schedule, "\n");
            if (schedule) { throw new Error("This date and time has already been reserved."); }
            // if (date + "T" + time < getDateUTC() + "T" + getTimeUTC()) { throw new Error("Concert must be scheduled for the future."); }

            // Find user who requested the schedule (login).
            let user: usersAttributes | undefined = undefined;
            users.findAll({
                attributes: { exclude: ['VerificationCode'] },
                where: { UserName: { [Op.eq]: username } }
            }).then((users) => {
                let first: users | undefined = users.at(0);
                if (users.length > 1) { console_log("Warning: Multiple users with same username and password detected.\n"); }
                if (!first) { throw new Error("User not found.") }
                user = first.dataValues;
                // if (user.IsVerified != 0) { throw new Error("Please verify email before scheduling.") } // Add back once email verification works.

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
                        const passcodes: number[] = generatePasscodes(6);
                        schedules.create({
                            GroupID: newGroup.GroupID,
                            Date: newGroup["Date"],
                            Time: newGroup["Time"],
                            MaestroPasscode: passcodes.at(0),
                            User1Passcode: passcodes.at(1),
                            User2Passcode: passcodes.at(2),
                            User3Passcode: passcodes.at(3),
                            User4Passcode: passcodes.at(4),
                            ListenerPasscode: passcodes.at(5)
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
            writeFileForce(TEMP_FOLDER + "passcodes/maestro/", maestroPasscode.toString(), "maestro");
            // Save groupId to file for socket server to read.
            writeFileForce(TEMP_FOLDER, "groupId", firstSchedule.GroupID?.toString());
            // Save timestamp to file.
            writeFileForce(TEMP_FOLDER, "timestamp", firstSchedule.Date + "T" + firstSchedule.Time);

            console_log("Maestro passcode and concert data saved to files.\n");
            return res.status(200).send({ message: "No errors caught. Maestro passcode and concert data saved to files." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

    async validatePerformer(req: Request, res: Response) {
        console_log("Validating performer. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        const { performerPasscode } = req.body;

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
            const firstSchedule: schedules | undefined = schedules.at(0);
            console_log("Schedule found: ", firstSchedule);
            if (schedules.length > 1) { console_log("Warning: Multiple schedules with same time detected.\n"); }
            if (!firstSchedule) { throw new Error("No concert found scheduled for the current time slot."); }
            console_log(performerPasscode);
            console_log(getPerformerPasscodes(firstSchedule));
            console_log(getPerformerPasscodes(firstSchedule).includes(parseInt(performerPasscode)));

            if (!getPerformerPasscodes(firstSchedule).includes(parseInt(performerPasscode))) { throw new Error("Passcode not found in the currently scheduled concert."); }

            // TODO: Store file paths in config file and import everywhere.
            writeFileForce(TEMP_FOLDER + "passcodes/performers/", performerPasscode.toString(), "performer");

            // Save timestamp to file.
            writeFileForce(TEMP_FOLDER, "timestamp", firstSchedule.Date + "T" + firstSchedule.Time);

            console_log("Passcode saved to file.\n");
            return res.status(200).send({ message: "No errors caught. Passcode saved to file." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

    async validateListener(req: Request, res: Response) {
        console_log("Validating performer. Current time: ", "\n");
        console_log(getTimeUTC(), "\n");
        console_log(getDateUTC(), "\n");

        const { listenerPasscode } = req.body;

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
            const firstSchedule: schedules | undefined = schedules.at(0);
            console_log("Schedule found: ", firstSchedule);
            if (schedules.length > 1) { console_log("Warning: Multiple schedules with same time detected.\n"); }
            if (!firstSchedule) { throw new Error("No concert found scheduled for the current time slot."); }
            console_log(listenerPasscode);
            console_log(getListenerPasscode(firstSchedule));
            console_log(getListenerPasscode(firstSchedule) == parseInt(listenerPasscode));

            if (getListenerPasscode(firstSchedule) != parseInt(listenerPasscode)) { throw new Error("Passcode not found in the currently scheduled concert."); }

            // TODO: Store file paths in config file and import everywhere.
            writeFileForce(TEMP_FOLDER + "passcodes/listener/", listenerPasscode.toString(), "listener");

            // Save timestamp to file.
            writeFileForce(TEMP_FOLDER, "timestamp", firstSchedule.Date + "T" + firstSchedule.Time);

            console_log("Passcode saved to file.\n");
            return res.status(200).send({ message: "No errors caught. Passcode saved to file." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }
}

export default ScheduleController;
