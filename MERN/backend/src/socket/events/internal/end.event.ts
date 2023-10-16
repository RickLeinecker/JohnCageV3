import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, Performer, waitingPerformer } from "../../socket.types";
import console_log from "../../../logging/console_log";
const fs = require("fs");

import { groups, recordings, schedules } from "../../../models/init-models";
const { Op } = require("sequelize");
const tempFileName: string = "recording.bin";
const WaveFile = require("wavefile").WaveFile;


// MUST KEEP TRACK OF PERFORMERS THAT LEFT EARLY. THIS IS INCOMPLETE.
const gatherNames = function (currentConcert: Concert): string[] {
    let names: string[] = [];

    // Add maestro's name first.
    let maestro = currentConcert.maestro;
    if (maestro) {
        names.push(maestro.nickname);
    }

    //  Add performers' names after.
    let performers = currentConcert.performers;
    for (let i = 0; i < performers.length; ++i) {
        let performer: Performer | undefined = performers.pop();
        if (performer) {
            names.push(performer.nickname);
        }
    }

    // Return all.
    return names;
}

const updateNames = async function (names: string[], groupId: number): Promise<boolean> {
    if (names.length < 4) {
        return false;
    }

    await groups.update(
        {
            GroupLeaderName: names.at(0),
            User1Name: names.at(1),
            User2Name: names.at(2),
            User3Name: names.at(3),
            User4Name: names.at(4)
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

const endConcert = function (currentConcert: Concert): void {
    // Save raw audio to file.
    fs.writeFileSync("./temp/" + tempFileName, currentConcert.mixedAudio, (e: any) => { if (e) { console_log(e); } });
    console_log("AAAAAAAAAAA\n");

    // Convert raw audio file to wav. 
    let wav = new WaveFile();
    let mixedBuffer: Buffer = currentConcert.mixedAudio;
    const samples16 = new Int16Array(mixedBuffer.buffer, mixedBuffer.byteOffset, mixedBuffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
    wav.fromScratch(1, 32000, '16', samples16);
    const fileName: string = Math.floor((Math.random() * 800000) + 100000).toString() + ".wav";
    fs.writeFileSync("./music/" + fileName, wav.toBuffer());
    console_log("BBBBBBBBBBB\n");

    // Gather data for database queries.
    const performerNames: string[] = gatherNames(currentConcert);
    const groupId = parseInt(fs.readFileSync("./temp/groupId").toString());
    console_log("groupId: ", groupId);
    console_log("CCCCCCCCCCC\n");

    // Update performer names in DB.
    updateNames(performerNames, groupId);

    // Create recording.
    recordings.create({
        GroupID: groupId,
        RecordingFileName: fileName
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

    console_log("Concert Ended\n");
}

export default endConcert;


// Get performer names // MUST KEEP TRACK OF PERFORMERS THAT LEFT EARLY.
// Save mixed buffer as wav or mp3 or whatever and save its file name.
// Get group id and make recordings row with groupid foreign id and filename.
// Remove row from scheduled using "where GroupID = groupid."
