import WebSocket from "ws";
import { addPerformer } from "../../handlers/performer.handler";
import { Concert, waitingPerformer } from "../../socket.types";

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

    currentConcert.active = true;
}

export default beginConcert;