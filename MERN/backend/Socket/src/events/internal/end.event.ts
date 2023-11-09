import WebSocket from "ws";
import { Concert, Performer, resetConcert, waitingPerformer } from "../../socket.types";
import console_log from "../../../../functions/logging/console_log";
import { removeDirectoryFiles } from "../../../../functions/file.functions";
const fs = require("fs");

const gatherNames = function (currentConcert: Concert): string[] {
    let names: string[] = [];

    for (let passcode in currentConcert.attendance) {
        names.push(currentConcert.attendance[passcode]);
    }

    console_log("Names gathered: ", names, "\n");
    console_log("Attendance: ", currentConcert.attendance, "\n");

    return names;
}

const endConcert = function (currentConcert: Concert): void {
    if (currentConcert.active) {
        console_log("Concert active.\n");

        // Gather data for saving concert to database.
        const performerNames: string[] = gatherNames(currentConcert);
        const idContents: any = fs.existsSync("../temp/groupId") ? fs.readFileSync("../temp/groupId") : -1;
        const tempAudioFile: any = fs.existsSync("../temp/title") ? fs.readFileSync("../temp/title").toString() : "Default Title";
        const groupId = parseInt(idContents.toString());
        console_log("groupId: ", groupId);
        console_log("Data gathered.\n");

        // Save raw audio to file for express server to format.
        fs.writeFileSync("../temp/" + tempAudioFile, currentConcert.mixedAudio, (e: any) => { if (e) { console_log(e); } });

        // Save data to files for express server to add into the DB.
        const concertData = {
            groupId: groupId,
            fileName: tempAudioFile,
            maestroName: performerNames.shift(),
            performerNames: performerNames
        }
        console_log("Concert Data saving to file: ", concertData);
        fs.writeFileSync("../temp/data", JSON.stringify(concertData), (e: any) => { if (e) { console_log(e); } });

        // Disconnect everyone.
        removeDirectoryFiles("../temp/" + "passcodes/maestro/");
        removeDirectoryFiles("../temp/" + "passcodes/performers/");
        removeDirectoryFiles("../temp/" + "passcodes/listener/");
        currentConcert.waitingPerformers?.forEach((perf) => {
            perf.socket.close();
        });
        currentConcert.performers?.forEach((perf) => {
            perf.socket.close();
        });
        currentConcert.listener?.socket.close();
        currentConcert.maestro?.socket.close();

        // Reset concert data.
        console_log("\n Concert Before: ", currentConcert);
        resetConcert(currentConcert);
        console_log("\n Concert After: ", currentConcert);
        console_log("Concert ended\n");
    }
}

export default endConcert;