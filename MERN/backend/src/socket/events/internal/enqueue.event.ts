import WebSocket from "ws";
import console_log from "../../../logging/console_log";
import { Concert, waitingPerformer } from "../../socket.types";

const enqueuePerformer = function (ws: WebSocket, currentConcert: Concert, name: string) {
    // Add performer to line before they are added to the concert.
    let waiting: waitingPerformer = { socket: ws, nickname: name }

    currentConcert.waitingPerformers.push(waiting);

    // Identify waiter socket and close connection.
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