// Debug
import console_log from "../../../functions/logging/console_log";

// Types/Classes
import WebSocket from "ws";
import { CustomHeader, Concert, Listener } from "../socket.types";

// Functions
import { retrieveHeader } from "../utilities/socket.binary";

const addListener = function (ws: WebSocket, currentConcert: Concert, name: string) {
    let listener: Listener = { socket: ws };
    currentConcert.listener = listener;
    defineListenerMessage(currentConcert);
    defineListenerClose(currentConcert);

    console_log("Listener joined concert: ");
    console_log(currentConcert.listener);
    console_log("\n");
}

const defineListenerMessage = function (currentConcert: Concert) {
    let listenerSocket: WebSocket | undefined = currentConcert.listener?.socket;

    // Handle messages.
    if (listenerSocket) {
        listenerSocket.on('message', function message(data) {
            console_log("Received message data: ", data, "\n");

            let message: Buffer = <Buffer>data;
            let headerData: CustomHeader = retrieveHeader(message);

            let headerEnd: number = headerData.headerEnd;
            let header: string = headerData.header;

            console_log("No Event Matches the Given Header: ", header, "\n");
        });
    }
}

const defineListenerClose = function (currentConcert: Concert) {
    let listenerSocket: WebSocket | undefined = currentConcert.listener?.socket;

    if (listenerSocket) {
        listenerSocket.on('close', function message(data) {
            removeListener(currentConcert);
        });
    }
}

const removeListener = function (currentConcert: Concert) {
    currentConcert.listener = undefined;
    console_log("Listener removed.");
    console_log(currentConcert.listener);
}

export { addListener };
