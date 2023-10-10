import { WebSocket } from "ws";
import console_log from "../../logging/console_log";
import { Concert } from "../types/socket.concert";

const enqueuePerformer = function (ws: WebSocket, currentConcert: Concert) {
    // Add performer to line before they are added to the concert.
    currentConcert.waitingPerformers.push(ws);

    console_log("New performer added to concert line: ");
    console_log(currentConcert.waitingPerformers);
    console_log("\n");
}

export default enqueuePerformer;