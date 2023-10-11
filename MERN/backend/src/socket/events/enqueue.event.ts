import { WebSocket } from "ws";
import console_log from "../../logging/console_log";
import { Concert, waitingPerformer } from "../socket.types";

const enqueuePerformer = function (ws: WebSocket, currentConcert: Concert, name: string) {
    // Add performer to line before they are added to the concert.
    let waiting: waitingPerformer = { socket: ws, nickname: name }
    currentConcert.waitingPerformers.push(waiting);

    console_log("New performer added to concert line: ");
    console_log(waiting);
    console_log("\n");
}

export default enqueuePerformer;