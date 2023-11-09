// Debug
import console_log from "../../../functions/logging/console_log";

// Types/Classes
import WebSocket from "ws";
import { CustomHeader, Concert, Listener } from "../socket.types";

// Functions
import { retrieveHeader } from "../utilities/socket.binary";
import { removePasscode } from "../functions/removepasscode";

const addConcertListener = function (ws: WebSocket, currentConcert: Concert, passcode: string) {
    let listener: Listener = { socket: ws, passcode: passcode };
    currentConcert.listener = listener;
    defineConcertListenerMessage(currentConcert);
    defineConcertListenerClose(currentConcert);

    console_log("Listener joined concert: ");
    console_log(currentConcert.listener);
    console_log("\n");
}

const defineConcertListenerMessage = function (currentConcert: Concert) {
    let listenerSocket: WebSocket | undefined = currentConcert.listener?.socket;

    // Handle messages.
    if (listenerSocket) {
        listenerSocket.on('message', function message(data) {
            console_log("Received Listener message data: ", data, "\n");

            let message: Buffer = <Buffer>data;
            let headerData: CustomHeader = retrieveHeader(message);

            let headerEnd: number = headerData.headerEnd;
            let header: string = headerData.header;

            console_log("No Event Matches the Given Header: ", header, "\n");
        });
    }
}

const defineConcertListenerClose = function (currentConcert: Concert) {
    let listener: Listener | undefined = currentConcert.listener;
    const passcode: string = listener?.passcode ? listener?.passcode : "0";

    if (listener) {
        listener.socket.on('close', function message(data) {
            removePasscode(currentConcert, passcode);
            removeConcertListener(currentConcert);
        });
    }
}

const removeConcertListener = function (currentConcert: Concert) {
    currentConcert.listener = undefined;
    console_log("Listener removed.");
    console_log(currentConcert.listener);
}

export { addConcertListener };
