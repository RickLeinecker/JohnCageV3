import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, Performer, waitingPerformer } from "../../socket.types";
import console_log from "../../../../functions/logging/console_log";
const fs = require("fs");

const gatherNames = function (currentConcert: Concert): string[] {
    let names: string[] = [];

    for (let passcode in currentConcert.attendance) {
        names.push(currentConcert.attendance[passcode]);
    }

    console_log("Names gathered: ", names, "\n");

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
            activePasscodes: [],
            mixerState: null,
            mixer: currentConcert.mixer
        };
        console_log("Concert ended\n");
    }
}

export default endConcert;