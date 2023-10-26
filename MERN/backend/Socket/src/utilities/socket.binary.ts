import console_log from "../../../functions/logging/console_log";
import { maxCustomHeaderSize } from "../socket.config";
import { Concert, waitingPerformer, Performer, CustomHeader, Listener } from "../socket.types";
import WebSocket from "ws";

const retrieveHeader = function (data: Buffer): CustomHeader {
    // Store message in Buffer and view through a DataView.
    let buffer: Buffer = Buffer.from(<Buffer>data);
    let thisView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

    // Get the event header in the form of 1 byte characters until the NULL character (0).
    let eventHeader: string = "";
    let isTerminated: boolean = false;
    let nextCharacter: string = String.fromCharCode(thisView.getUint8(0));
    let headerEnd: number = 0;
    for (let i = 0; i < maxCustomHeaderSize && i < thisView.byteLength; ++i) {
        nextCharacter = String.fromCharCode(thisView.getUint8(i));
        if (nextCharacter == String.fromCharCode(0)) {
            headerEnd = i;
            isTerminated = true;
            break;
        }
        eventHeader = eventHeader.concat(nextCharacter);
    }

    console_log("Detected header: ");
    console_log(eventHeader);
    console_log("\n");

    let headerInfo: CustomHeader = { header: eventHeader, headerEnd: headerEnd };
    return headerInfo;
}

const retrieveMessageContents = function (message: Buffer, headerEnd: number): ArrayBuffer {
    return message.buffer.slice(message.byteOffset + headerEnd + 1, message.byteOffset + message.byteLength);
}

const broadcastMessage = function (currentConcert: Concert, message: Uint8Array, perf: boolean, waiters: boolean, maestro: boolean, listener: boolean): void {
    if (perf) {
        broadcastPerformers(currentConcert.performers, message);
    }

    if (waiters) {
        broadcastWaiting(currentConcert.waitingPerformers, message);
    }

    if (maestro) {
        broadcastMaestro(currentConcert.maestro, message);
    }

    if (listener) {
        broadcastListener(currentConcert.listener, message);
    }
}

const broadcastListener = function (listener: Listener | undefined, message: Uint8Array): void {
    // Send to Maestro
    if (listener) {
        let listenerSocket = listener.socket;
        if (listenerSocket) {
            listenerSocket.send(message);
        }
    }
}

const broadcastPerformers = function (performers: Performer[], message: Uint8Array): void {
    // Send to performers
    for (let i = 0; i < performers.length; ++i) {
        let performerSocket: WebSocket | undefined = performers.at(i)?.socket;
        if (performerSocket) {
            performerSocket.send(message);
        }
    }
}

const broadcastWaiting = function (waitList: waitingPerformer[], message: Uint8Array): void {
    // Send to waiting performers
    for (let i = 0; i < waitList.length; ++i) {
        let waiter: waitingPerformer | undefined = waitList.at(i);
        if (waiter) {
            waiter.socket.send(message);
        }
    }
}

const broadcastMaestro = function (maestro: Performer | undefined, message: Uint8Array): void {
    // Send to Maestro
    if (maestro) {
        let maestroSocket = maestro.socket;
        if (maestroSocket) {
            maestroSocket.send(message);
        }
    }
}

export { retrieveMessageContents, retrieveHeader, broadcastMessage };