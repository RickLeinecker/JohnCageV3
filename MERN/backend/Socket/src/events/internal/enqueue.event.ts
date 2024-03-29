import WebSocket from "ws";
import console_log from "../../../../functions/logging/console_log";
import { Concert, waitingPerformer } from "../../socket.types";

// Add performer to waitlist before concert.
const enqueuePerformer = function (ws: WebSocket, currentConcert: Concert, name: string, passcode: string) {
    let waiting: waitingPerformer = { socket: ws, nickname: name, passcode: passcode }
    currentConcert.waitingPerformers.push(waiting);

    // Define onclose event for waiter sockets.
    ws.on('close', function message(data) {
        for (let i = 0; i < currentConcert.waitingPerformers.length; ++i) {
            const waiter = currentConcert.waitingPerformers.at(i);
            if (waiter && waiter.socket === ws) {
                // Close socket.
                ws.close();

                // Remove active passcode.
                const activePasscodeIndex = currentConcert.activePasscodes.indexOf(waiter.passcode);
                if (activePasscodeIndex > -1) { currentConcert.activePasscodes.splice(activePasscodeIndex, 1); console_log(currentConcert.activePasscodes); }
                else { console_log("Passcode removal failed"); }

                // Remove waiter.
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