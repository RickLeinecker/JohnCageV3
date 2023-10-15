import { Request, Response, response } from "express";
import console_log from "../logging/console_log";
import { users, groups, schedules, groupsAttributes, usersAttributes, schedulesAttributes } from "../models/init-models";
const ms = require('mediaserver');
const { Op } = require("sequelize");
const fs = require("fs");
import bcryptjs from 'bcryptjs';

interface scheduleAPI {
    scheduleConcert(req: Request, res: Response): Promise<void>;
    getSchedule(req: Request, res: Response): Promise<void>;
    prepareConcert(req: Request, res: Response): Promise<void>;
}

const getFlooredTime = function (time: string): string {
    let object = new Date();
    let hours: string = object.getUTCHours().toString();
    let minutes: string = (Math.floor(object.getUTCMinutes() / 20) * 20).toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    let seconds: string = "00";

    return hours + ":" + minutes + ":" + seconds;
}

const getDateUTC = function (): string {
    let object = new Date();
    return object.getUTCFullYear().toString() + "-" + object.getUTCMonth().toString() + "-" + object.getUTCDate().toString();
}

const getTimeUTC = function (): string {
    let object = new Date();
    return object.getUTCHours().toString() + ":" + object.getUTCMinutes().toString() + ":" + object.getUTCSeconds().toString();
}

// Adds a backtick between tags as a separater to simplify storing/searching tags in MySQL.
const concatTags = function (tags: string[]): string {
    let cTags: string = "";
    for (let i = 0; i < tags.length - 1; ++i) {
        cTags = cTags + tags.at(i) + '`';
    }
    cTags = cTags + tags.at(tags.length - 1);

    return cTags;
}

// Probably works every time but might need some testing.
// Each code must be unique and there must be exactly the number that is passed.
// Also must be 6 digit, although it shouldn't breka anything if it isn't.
const generatePasscodes = function (count: number): number[] {
    let passCodes: number[] = [];
    for (let i = 0; i < count; ++i) {
        let newCode = Math.floor((Math.random() * 800000) + 100000);

        while (passCodes.includes(newCode)) {
            console_log("Duplicate passcode; adding 5 until unique.")
            newCode = newCode + 5;
        }

        passCodes.push(newCode);
    }

    console_log("Passcodes generated: ", passCodes, "\n");
    return passCodes;
}

class ScheduleController implements scheduleAPI {
    // IMPORTANT: DOES NOT CHECK IF TIME IS ALREADY SCHEDULED YET.
    // IMPORTANT: DATE AND TIME IN BOTH GROUPS AND SHCEDULES. REDUNDANT.
    // IMPORTANT: DOES NOT AUTHENTICATE USER.
    async scheduleConcert(req: Request, res: Response) {
        // Inputs
        console_log("Request body: ", req.body, "\n");
        const { maestroId, maestroName, concertTitle, concertTags, concertDescription, date, time } = req.body;
        const tags: string = concatTags(concertTags);

        // Create new group.
        let newGroup: groupsAttributes;
        let newSchedule: schedulesAttributes;
        await groups.create({
            GroupLeaderID: maestroId,
            GroupLeaderName: maestroName,
            Title: concertTitle,
            Tags: tags,
            Description: concertDescription,
            Date: date,
            Time: time
        }).then((group) => {
            newGroup = group.dataValues;
            if (!newGroup) {
                throw new Error("Error: newGroup is undefined.");
            }

            // Schedule recording.
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
                if (!newSchedule) {
                    throw new Error("Failed to create new schedule. Unknown error.");
                }

                console_log("New schedule: ", newSchedule, "\n");
                return res.status(200).send({ group: newGroup, schedule: newSchedule });
            }).catch((e) => {
                console_log("Error: ", e.message, "\n");
                return res.status(500).send({ error: e.message });
            });

        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

    // Get all scheduled recording times for a specific day.
    async getSchedule(req: Request, res: Response) {
        const date = typeof req.query.date === "string" ? req.query.date : "";
        console_log("Date: ", date, "\n");

        let schedule: Set<string> = new Set();
        await schedules.findAll({
            attributes: { exclude: ['VerificationCode'] },
            where: {
                Date: {
                    [Op.eq]: date
                }
            }
        }).then((scheduled) => {
            scheduled.forEach((scheduleData) => {
                let time: string | undefined = scheduleData.dataValues.Time;
                if (time) {
                    schedule.add(time);
                }
            })

            console_log("Scheduled times: ", schedule, "\n");
            return res.status(200).send({ scheduledTimes: Array.from(schedule) });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

    async prepareConcert(req: Request, res: Response) {
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
                    [Op.between]: [getFlooredTime(currentTime), currentTime]
                }
            }
        }).then((schedules) => {
            console_log("schedules: ", schedules);

            if (schedules.length > 1) {
                console_log("Warning: Multiple schedules with same time detected.\n");
            }
            let first: schedules | undefined = schedules.at(0);
            if (!first) {
                throw new Error("No concert found scheduled for the current time slot.");
            }
            else if (parseInt(maestroPasscode) != first.MaestroPasscode) {
                throw new Error("Maestro passcode does not match that of the currently scheduled recording.");
            }

            // Save passcodes to files for the socket server to check. // INCOMPLETE
            console_log("SAVE PASSCODES TO FILE HERE.");
            console_log(getTimeUTC());
            console_log(getDateUTC());

            return res.status(200).send({ message: "No errors caught." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }
}

export default ScheduleController;


/*  Essentially login, but also checks for verification.


    // Hash password.
        const hash = await bcryptjs.hash(password, 10).catch(() => {
            return res.status(500).send({ error: "Hashing password failed." });
        });

        // Verify user.
        let user: usersAttributes | undefined = undefined;
        await users.findAll({
            attributes: { exclude: ['VerificationCode'] },
            where: {
                UserName: {
                    [Op.eq]: username
                },
                Password: {
                    [Op.eq]: hash
                },
                IsVerified: {
                    [Op.eq]: 1
                }
            }
        }).then((users) => {
            if (users.length > 1) {
                console_log("Warning: Multiple users with same username and password detected.\n");
            }
            let first: users | undefined = users.at(0);
            if (first) {
                user = first.dataValues;
                if (!user.IsVerified) {
                    throw new Error("User not verified.");
                }
            }
        }).catch((e) => {
            return res.status(500).send({ error: e.message });
        });

        if (!user) {
            return res.status(500).send({ error: "User not found." });
        }
*/
