import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, Performer, waitingPerformer } from "../../socket.types";
import console_log from "../../../../functions/logging/console_log";
const fs = require("fs");

// MUST KEEP TRACK OF PERFORMERS THAT LEFT EARLY. THIS IS INCOMPLETE.
const gatherNames = function (currentConcert: Concert): string[] {
    let names: string[] = [];

    // // Add maestro's name first.
    // let maestro = currentConcert.maestro;
    // if (maestro) {
    //     names.push(maestro.nickname);
    // }

    // //  Add performers' names after.
    // let performers = currentConcert.performers;
    // for (let i = 0; i < performers.length; ++i) {
    //     let performer: Performer | undefined = performers.pop();
    //     if (performer) {
    //         names.push(performer.nickname);
    //     }
    // }

    for (let passcode in currentConcert.attendance) {
        names.push(currentConcert.attendance[passcode]);
    }

    // Return all.
    return names;
}

const endConcert = function (currentConcert: Concert): void {
    if (currentConcert.active) {
        console_log("Concert active.\n");

        // Gather data for saving concert to database.
        const performerNames: string[] = gatherNames(currentConcert);
        const idContents: any = fs.existsSync("../temp/groupId") ? fs.readFileSync("../temp/groupId") : -1;
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

        // Reset concert data.
        currentConcert = {
            performers: [],
            maestro: undefined,
            waitingPerformers: [],
            active: false,
            mixedAudio: Buffer.alloc(2),
            listener: undefined,
            attendance: {},
            activePasscodes: []
        };
        console_log("Concert ended\n");
    }
}

export default endConcert;