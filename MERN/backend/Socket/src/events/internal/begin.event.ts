import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, waitingPerformer } from "../../socket.types";
import endConcert from "./end.event";
import { getNextTimeslot, minutesToMilliseconds } from "../../../../functions/date.functions";

// MISSING: GET GROUP FROM MYSQL. NEEDED TO MODIFY NAME AND READ ID FOR RECORDING CREATION.
const beginConcert = function (currentConcert: Concert): void {
    let waitingPerformers = currentConcert.waitingPerformers;
    let numWaiting = waitingPerformers.length;

    for (let i = 0; i < numWaiting; ++i) {
        let waitingPerformer: waitingPerformer | undefined = waitingPerformers.pop();
        if (waitingPerformer) {
            addPerformer(waitingPerformer.socket, currentConcert, waitingPerformer.nickname);
        }
    }

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