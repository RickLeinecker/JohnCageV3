import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, Performer, waitingPerformer } from "../../socket.types";
import console_log from "../../../logging/console_log";
const fs = require("fs");

const tempFileName: string = "recording.bin";

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

const endConcert = function (currentConcert: Concert): void {
    // Get performer names // MUST KEEP TRACK OF PERFORMERS THAT LEFT EARLY.
    // Save mixed buffer as wav or mp3 or whatever and save its file name.
    // Get group id and make recordings row with groupid foreign id and filename.
    // Remove row from scheduled useing "where GroupID = groupid."

    const performerNames: string[] = gatherNames(currentConcert);

    fs.writeFile("./temp/" + tempFileName, currentConcert.mixedAudio, { flag: 'a' }, (err: any) => {
        if (err) {
            console.error(err);
        }
    });
}

export default endConcert;