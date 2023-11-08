import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, waitingPerformer } from "../../socket.types";
import endConcert from "./end.event";
import { getNextTimeslot, minutesToMilliseconds } from "../../../../functions/date.functions";
import console_log from "../../../../functions/logging/console_log";
const defaultMix = require("../../mixers/default.mix.js");
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
        setInterval(() => endConcert(currentConcert), minutesToMilliseconds(10));
    }
    else {
        setInterval(() => endConcert(currentConcert), msUntilNextSlot - minutesToMilliseconds(1));
    }
}

export default beginConcert;