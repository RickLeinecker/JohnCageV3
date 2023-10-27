import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, Performer, waitingPerformer } from "../../socket.types";
import console_log from "../../../../functions/logging/console_log";
const fs = require("fs");
const WaveFile = require("wavefile").WaveFile;

// import { MUSIC_FOLDER } from "../../../../config/backend.config";

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

    // await groups.update(
    //     {
    //         GroupLeaderName: names.at(0),
    //         User1Name: names.at(1),
    //         User2Name: names.at(2),
    //         User3Name: names.at(3),
    //         User4Name: names.at(4)
    //     },
    //     { where: { GroupID: { [Op.eq]: groupId } } }
    // ).then((group) => {
    //     console_log("Updated group: ", group, "\n");
    // }).catch((e) => {
    //     console_log(e.message, "]\n");
    //     return false;
    // });

    return true;
}

const endConcert = function (currentConcert: Concert): void {
    if (currentConcert.active) {
        console_log("Concert active.\n");

        // Gather data for saving concert to database.
        const performerNames: string[] = gatherNames(currentConcert);
        let idContents = -1;
        try { idContents = fs.readFileSync("../temp/groupId", (e: any) => { if (e) { console_log(e); } }); }
        catch (e: any) { console_log("Error: ", e, "\n"); }
        const groupId = parseInt(idContents.toString());
        console_log("groupId: ", groupId);
        console_log("Data gathered.\n");

        // Save data to files for express server to add into the DB.
        const concertDate = {
            groupId: groupId,
            fileName: "recording.bin",
            maestroName: performerNames.shift(),
            performerNames: performerNames
        }
        fs.writeFileSync("../temp/data", JSON.stringify(concertDate), (e: any) => { if (e) { console_log(e); } });

        // Save raw audio to file for express server to format.
        fs.writeFileSync("../temp/recording.bin", currentConcert.mixedAudio, (e: any) => { if (e) { console_log(e); } });



        // // Convert raw audio file wav. 
        // let wav = new WaveFile();
        // let mixedBuffer: Buffer = currentConcert.mixedAudio;
        // const samples16 = new Int16Array(mixedBuffer.buffer, mixedBuffer.byteOffset, mixedBuffer.byteLength / Int16Array.BYTES_PER_ELEMENT);
        // wav.fromScratch(1, 32000, '16', samples16);
        // const fileName: string = Math.floor((Math.random() * 800000) + 100000).toString() + ".wav";
        // fs.writeFileSync(MUSIC_FOLDER + fileName, wav.toBuffer());
        // console_log("Audio converted.\n");

        // // Update performer names in DB.
        // updateNames(performerNames, groupId);

        // // Create recording.
        // recordings.create({
        //     GroupID: groupId,
        //     RecordingFileName: fileName
        // }).then((recording) => {
        //     let newRecording = recording.dataValues;

        //     console_log("New recording: ", newRecording, "\n");
        // }).catch((e) => {
        //     console_log("Error: ", e.message, "\n");
        // });

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

        currentConcert.mixedAudio = Buffer.alloc(2);
        currentConcert.active = false;
        console_log("Concert ended\n");
    }
}

export default endConcert;


// // Save raw audio to file.
// fs.writeFileSync("./temp/" + tempFileName, currentConcert.mixedAudio, (e: any) => { if (e) { console_log(e); } });   

// Get performer names // MUST KEEP TRACK OF PERFORMERS THAT LEFT EARLY.
// Save mixed buffer as wav or mp3 or whatever and save its file name.
// Get group id and make recordings row with groupid foreign id and filename.
// Remove row from scheduled using "where GroupID = groupid."