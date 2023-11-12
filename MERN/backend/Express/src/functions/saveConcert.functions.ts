import { groups, recordings, schedules } from "../models/init-models";
import console_log from "../../../functions/logging/console_log";
import { readFileSync } from "fs";
import { TEMP_FOLDER } from "../../config/express.config";
const WaveFile = require("wavefile").WaveFile;
const fs = require("fs");
import { MUSIC_FOLDER } from "../../config/express.config";
import { Op } from "sequelize";

// Since this is reading arbitrary data from file, it needs more careful input validation.
const saveConcert = function () {

    // Read from JSON saved to file.
    const path = TEMP_FOLDER + "data";
    const concertData: any = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path).toString()) : "";

    if (concertData != "") {
        const performerNames: string[] = concertData.performerNames as string[] || [];
        const groupId: number = concertData.groupId as number || -1;
        const maestroName: string = concertData.maestroName as string || "John Cage";
        const fileName: string = concertData.fileName as string || groupId + maestroName + "default" + Math.floor((Math.random() * 800000) + 100000).toString();

        console_log("Concert data: ", concertData);
        console_log("performerNames: ", performerNames);
        console_log("groupId: ", groupId);
        console_log("fileName: ", fileName);
        console_log("maestroName: ", maestroName);

        console_log("Starting save concert..");

        // // Convert raw audio file wav. 
        const path = TEMP_FOLDER + fileName;
        const formattedAudioFile = fileName + ".wav";
        const mixedBuffer: Buffer | undefined = fs.existsSync(path) ? readFileSync(path) : undefined;
        // const fileName: string = Math.floor((Math.random() * 800000) + 100000).toString() + ".wav";
        if (mixedBuffer) {
            let wav = new WaveFile();
            const samples16 = new Int16Array(mixedBuffer.buffer, mixedBuffer.byteOffset, mixedBuffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
            wav.fromScratch(1, 32000, '16', samples16);
            fs.writeFileSync(MUSIC_FOLDER + formattedAudioFile, wav.toBuffer());
            console_log("Audio converted.\n");
        }

        // Update performer names in DB.
        updateNames(maestroName, performerNames, groupId);

        // Create recording.
        recordings.create({
            GroupID: groupId,
            RecordingFileName: formattedAudioFile
        }).then((recording) => {
            let newRecording = recording.dataValues;

            console_log("New recording: ", newRecording, "\n");
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
        });

        // Deleting immediately might allow someone to schedule for same timeslot if the concert ends early.
        // Deleting schedules in the past every month or so with a simple MySQL query is a more safe solution.
        // // Delete current schedule record.
        // schedules.destroy({
        //     where: {
        //         GroupID: groupId
        //     }
        // }).then((schedule) => {
        //     console_log("Schedule deleted: ", schedule, "\n");
        // }).catch((e) => {
        //     console_log("Error: ", e.message, "\n");
        // });
    }
}

const updateNames = async function (maestro: string, names: string[], groupId: number): Promise<boolean> {
    if (names && names.length && names.length > 4) {
        return false;
    }

    await groups.update(
        {
            GroupLeaderName: maestro,
            User1Name: names.at(0),
            User2Name: names.at(1),
            User3Name: names.at(2),
            User4Name: names.at(3)
        },
        { where: { GroupID: { [Op.eq]: groupId } } }
    ).then((group) => {
        console_log("Updated group: ", group, "\n");
    }).catch((e) => {
        console_log(e.message, "]\n");
        return false;
    });

    return true;
}

export { saveConcert };