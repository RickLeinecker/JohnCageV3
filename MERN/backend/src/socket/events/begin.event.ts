import WebSocket from "ws";
import { addPerformer } from "../handlers/performer.handler";
import { Concert } from "../types/socket.concert";

const beginConcert = function (currentConcert: Concert): void {
    let waitingSockets = currentConcert.waitingPerformers;
    let numWaiting = waitingSockets.length;

    for (let i = 0; i < numWaiting; ++i) {
        let socket: WebSocket | undefined = waitingSockets.pop();
        if (socket) {
            addPerformer(socket, currentConcert);
            // TODO: Send signal to frontend to signify beginning.
        }
    }

    currentConcert.active = true;
}

export default beginConcert;