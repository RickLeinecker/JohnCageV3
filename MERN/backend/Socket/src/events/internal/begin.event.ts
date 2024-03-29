import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, waitingPerformer } from "../../socket.types";
import endConcert from "./end.event";
import { getNextTimeslot, minutesToMilliseconds } from "../../../../functions/date.functions";
import console_log from "../../../../functions/logging/console_log";
const defaultMix = require("../../mixers/default.mix");
const fs = require("fs");

const beginConcert = function (currentConcert: Concert): void {
    // Set mixer.
    currentConcert.mixer = defaultMix;
    try {
        const mixerFileName: any = fs.existsSync("../temp/mixer") ? fs.readFileSync("../temp/mixer") : "DefaultMixer.mix.js";
        currentConcert.mixer = require("../../mixers/" + mixerFileName);
    }
    catch (e) { console_log(e); currentConcert.mixer = defaultMix; }

    // Change waiting performers to performers with the related socket handler.
    let waitingPerformers = currentConcert.waitingPerformers;
    let numWaiting = waitingPerformers.length;
    for (let i = 0; i < numWaiting; ++i) {
        let waitingPerformer: waitingPerformer | undefined = waitingPerformers.pop();
        if (waitingPerformer) {
            addPerformer(waitingPerformer.socket, currentConcert, waitingPerformer.nickname, waitingPerformer.passcode);
        }
    }

    // Reset some concert data.
    currentConcert.mixedAudio = Buffer.alloc(2);
    currentConcert.active = true;

    // End concert automatically after a certain time.
    const msUntilNextSlot = getNextTimeslot(minutesToMilliseconds(20));
    if (msUntilNextSlot - minutesToMilliseconds(1) > minutesToMilliseconds(10)) {
        setTimeout(() => endConcert(currentConcert), minutesToMilliseconds(10));
    }
    else {
        setTimeout(() => endConcert(currentConcert), msUntilNextSlot - minutesToMilliseconds(1));
    }

    try {
        // Make sure a finished file is not present from a previous concert.
        if (fs.existsSync("../temp/finished")) { fs.unlink("../temp/finished"); }
    }
    catch (e) { console_log(e); }
}

export default beginConcert;