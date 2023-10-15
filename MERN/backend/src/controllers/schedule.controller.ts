import { Request, Response, response } from "express";
import console_log from "../logging/console_log";
import { users, groups, schedules, groupsAttributes, usersAttributes, schedulesAttributes } from "../models/init-models";
const { Op } = require("sequelize");
const fs = require("fs");
import bcryptjs from 'bcryptjs';

interface scheduleAPI {
    scheduleConcert(req: Request, res: Response): Promise<void>;
    getSchedule(req: Request, res: Response): Promise<void>;
    prepareConcert(req: Request, res: Response): Promise<void>;
}

const getPerformerPasscodes = function (schedule: schedulesAttributes): number[] {
    // Does not get maestro's, since that was required to even get here.
    let passcodes: number[] = [];
    if (schedule.User1Passcode) { passcodes.push(schedule.User1Passcode); }
    if (schedule.User2Passcode) { passcodes.push(schedule.User2Passcode); }
    if (schedule.User3Passcode) { passcodes.push(schedule.User3Passcode); }
    if (schedule.User4Passcode) { passcodes.push(schedule.User4Passcode); }
    return passcodes;
}

const storePasscodes = function (passcodes: number[]): boolean {
    passcodes.forEach((passcode, index) => {
        fs.writeFile("./temp/passcode" + (index + 1), passcode.toString(), { flag: 'a' }, (err: any) => {
            if (err) {
                console_log(err.message);
                return false;
            }
        });
    })

    return true
}

const getFlooredTime = function (time: string): string {
    let object = new Date();
    let hours: string = object.getUTCHours().toString();
    if (hours.length == 1) {
        hours = "0" + hours;
    }
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
    let minutes = object.getUTCMinutes().toString();
    let hours = object.getUTCHours().toString();
    let seconds = object.getUTCSeconds().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    if (hours.length == 1) {
        hours = "0" + hours;
    }
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
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
// Also must be 6 digit, although it shouldn't break anything if it isn't.
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

// const updateNames = async function (names: string[], groupId: number): Promise<boolean> {
//     if (names.length < 4) {
//         return false;
//     }

//     await groups.update(
//         {
//             User1Name: names.at(0),
//             User2Name: names.at(1),
//             User3Name: names.at(2),
//             User4Name: names.at(3)
//         },
//         { where: { GroupID: { [Op.eq]: groupId } } }
//     ).then((group) => {
//         console_log(group);
//     }).catch((e) => {
//         console_log(e.message);
//         return false;
//     });

//     return true;
// }

class ScheduleController implements scheduleAPI {
    // IMPORTANT: DOES NOT CHECK IF TIME IS ALREADY SCHEDULED YET.
    // IMPORTANT: DATE AND TIME IN BOTH GROUPS AND SHCEDULES. MAYBE REDUNDANT.
    async scheduleConcert(req: Request, res: Response) {
        // Inputs
        const { concertTitle, concertTags, concertDescription, date, time, username, password } = req.body;
        const tags: string = concatTags(concertTags);

        console_log(getTimeUTC(), getDateUTC(), "\n");

        // Find user.
        let user: usersAttributes | undefined = undefined;
        await users.findAll({
            attributes: { exclude: ['VerificationCode'] },
            where: { UserName: { [Op.eq]: username } }
        }).then((users) => {
            let first: users | undefined = users.at(0);
            if (users.length > 1) { console_log("Warning: Multiple users with same username and password detected.\n"); }
            bcryptjs.compare(password, users[0].Password, (e, equal) => {
                if (e) { return res.status(401).json({ error: e.message }); }
                else if (!equal) { return res.status(401).json({ error: "Incorrect password." }); }
            });
            if (!first) { throw new Error("User not found.") }
            user = first.dataValues;
            // if (user.IsVerified != 0) { throw new Error("Please verify email befoer scheduling.") } // Add back once email verification works.

            // Create group.
            let newGroup: groupsAttributes;
            let newSchedule: schedulesAttributes;
            groups.create({
                GroupLeaderID: user.ID,
                GroupLeaderName: user.Name,
                Title: concertTitle,
                Tags: tags,
                Description: concertDescription,
                Date: date,
                Time: time
            }).then((group) => {
                newGroup = group.dataValues;

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
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }

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

            console_log("Scheduled times: ", schedule, "\n\n");
            return res.status(200).send({ scheduledTimes: Array.from(schedule) });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n\n");
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

            console_log(getTimeUTC(), "\n");
            console_log(getDateUTC(), "\n");

            return res.status(200).send({ message: "No errors caught. Passcodes saved to files." });
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
            return res.status(500).send({ error: e.message });
        });
    }
}

export default ScheduleController;
