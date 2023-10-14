import { Request, Response } from "express";
import recordingRepository from "../repositories/recording.repository";
import console_log from "../logging/console_log";
import { tags, tagsAttributes, recordings, groups, schedules, groupsAttributes } from "../models/init-models";
import { Sequelize, DataTypes } from "sequelize";
const ms = require('mediaserver');
const { Op } = require("sequelize");
const fs = require("fs");

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

class ScheduleController {
    // IMPORTANT: DOES NOT CHECK IF TIME IS ALREADY SCHEDULED YET.
    // IMPORTANT: DATE AND TIME IN BOTH GROUPS AND SHCEDULES. REDUNDANT.
    async scheduleConcert(req: Request, res: Response) {
        // Inputs
        console_log("Request body: ", req.body, "\n");
        const { maestroId, maestroName, concertTitle, concertTags, concertDescription, date, time } = req.body;
        const tags: string = concatTags(concertTags);

        // Create new group.
        let newGroup: groupsAttributes | undefined = undefined;
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
        }).catch((e) => {
            console_log("Error: ", e, "\n");
            return res.status(500).send(e);
        });

        // Verify group.
        if (!newGroup) {
            console_log("Error: newGroup is undefined.\n");
            return res.status(500).send("Failed to create new group. Unknown error.");
        }
        console_log("New group: ", newGroup, "\n");


        // Gather passcodes for concert.
        const passcodes: number[] = generatePasscodes(5);

        // Create new group.
        let newSchedule = undefined;
        await schedules.create({
            GroupID: newGroup["GroupID"],
            Date: newGroup["Date"],
            Time: newGroup["Time"],
            MaestroPasscode: passcodes.at(0),
            User1Passcode: passcodes.at(1),
            User2Passcode: passcodes.at(2),
            User3Passcode: passcodes.at(3),
            User4Passcode: passcodes.at(4)
        }).then((schedule) => {
            newSchedule = schedule.dataValues;
        }).catch((e) => {
            console_log("Error: ", e, "\n");
            return res.status(500).send(e);
        });

        // Verify schedule.
        if (!newSchedule) {
            console_log("Error: newSchedule is undefined.\n");
            return res.status(500).send("Failed to create new schedule. Unknown error.");
        }
        console_log("New schedule: ", newSchedule, "\n");

        return res.status(200).send({ group: newGroup, schedule: newSchedule });
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
            console_log("Times got: ", schedule, "\n");
        }).catch((e) => {
            console_log("Error: ", e, "\n");
            return res.status(500).send(e);
        });

        console_log("Scheduled times: ", schedule, "\n");

        return res.status(200).send({ scheduledTimes: Array.from(schedule) });
    }

    // POST
    async prepareConcert(req: Request, res: Response) {
        // Authenticate user.
        // Save passcodes to files for the socket server to check.
    }
}

export default ScheduleController;
