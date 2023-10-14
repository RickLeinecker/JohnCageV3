import WebSocket from "ws";
import console_log from "../../../logging/console_log";
import { Concert, waitingPerformer } from "../../socket.types";

// Add performer to waitlist before concert.
const enqueuePerformer = function (ws: WebSocket, currentConcert: Concert, name: string) {
    let waiting: waitingPerformer = { socket: ws, nickname: name }
    currentConcert.waitingPerformers.push(waiting);

    // Define onclose event for waiter sockets.
    ws.on('close', function message(data) {
        for (let i = 0; i < currentConcert.waitingPerformers.length; ++i) {
            if (currentConcert.waitingPerformers.at(i)?.socket === ws) {
                ws.close();
                currentConcert.waitingPerformers.splice(i, 1);
                console_log("Waiting performer removed. Current waitlist: ");
                console_log(currentConcert.waitingPerformers);
            }
        }
        console_log("\n");
    });

    console_log("New performer added to concert line: ");
    console_log(waiting);
    console_log(currentConcert.waitingPerformers);
    console_log("\n");
}

export default enqueuePerformer;