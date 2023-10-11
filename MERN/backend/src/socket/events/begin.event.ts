import WebSocket from "ws";
import { addPerformer } from "../handlers/performer.handler";
import { Concert, waitingPerformer } from "../socket.types";

const beginConcert = function (currentConcert: Concert): void {
    let waitingPerformers = currentConcert.waitingPerformers;
    let numWaiting = waitingPerformers.length;

    for (let i = 0; i < numWaiting; ++i) {
        let waitingPerformer: waitingPerformer | undefined = waitingPerformers.pop();
        if (waitingPerformer) {
            addPerformer(waitingPerformer.socket, currentConcert, waitingPerformer.nickname);
            // TODO: Send signal to frontend to signify beginning.
        }
    }

    currentConcert.active = true;
}

export default beginConcert;