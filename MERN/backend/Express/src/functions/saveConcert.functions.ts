import { groups, recordings, schedules } from "../models/init-models";
import console_log from "../../../functions/logging/console_log";
import { readFileSync } from "fs";
import { TEMP_FOLDER } from "../../config/express.config";
const WaveFile = require("wavefile").WaveFile;
const fs = require("fs");
import { MUSIC_FOLDER } from "../../config/express.config";
import { Op } from "sequelize";

// NEEDS TO CATCH INVA:ID INPUTS BETTER.
// Since this is reading arbitrary data from file, it needs more careful input validation.
// Appears to work on first testing.
const saveConcert = function () {

    // Read from json
    const path = TEMP_FOLDER + "data";
    const concertData: any = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path).toString()) : "";

    const performerNames: string[] = concertData.performerNames as string[] || [];
    const groupId: number = concertData.groupId as number || -1;
    const fileName: string = concertData.fileName as string || "default";
    const maestroName: string = concertData.maestroName as string || "John Cage";

    console_log("Concert data: ", concertData);
    console_log("performerNames: ", performerNames);
    console_log("groupId: ", groupId);
    console_log("fileName: ", fileName);
    console_log("maestroName: ", maestroName);

    if (concertData != "") {
        console_log("Starting save concert..");

        // // Convert raw audio file wav. 
        const path = TEMP_FOLDER + "recording.bin";
        const mixedBuffer: Buffer | undefined = fs.existsSync(path) ? readFileSync(path) : undefined;
        const fileName: string = Math.floor((Math.random() * 800000) + 100000).toString() + ".wav";
        if (mixedBuffer) {
            let wav = new WaveFile();
            const samples16 = new Int16Array(mixedBuffer.buffer, mixedBuffer.byteOffset, mixedBuffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
            wav.fromScratch(1, 32000, '16', samples16);
            fs.writeFileSync(MUSIC_FOLDER + fileName, wav.toBuffer());
            console_log("Audio converted.\n");
        }

        // Update performer names in DB.
        updateNames(maestroName, performerNames, groupId);

        // Create recording.
        recordings.create({
            GroupID: groupId,
            RecordingFileName: fileName // NEED TO FIX TO MAKE UNIQWUE GARUNTEED
        }).then((recording) => {
            let newRecording = recording.dataValues;

            console_log("New recording: ", newRecording, "\n");
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
        });

        // Delete current schedule record.
        schedules.destroy({
            where: {
                GroupID: groupId
            }
        }).then((schedule) => {
            console_log("Schedule deleted: ", schedule, "\n");
        }).catch((e) => {
            console_log("Error: ", e.message, "\n");
        });
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