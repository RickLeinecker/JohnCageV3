import { CustomHeader } from "../types/socket.header";
import console_log from "../../logging/console_log";
import { maxCustomHeaderSize } from "../socket.config";
import { Concert } from "../types/socket.concert";
import WebSocket from "ws";
import { Performer } from "../types/socket.participant";

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

const signalJoin = function (currentConcert: Concert, name: string): void {
    let utf8Encode = new TextEncoder();
    broadcastMessage(currentConcert, utf8Encode.encode("participantAdded:" + name));
}

const broadcastMessage = function (currentConcert: Concert, message: Uint8Array): void {
    // Send to performers
    let performers = currentConcert.performers;
    for (let i = 0; i < performers.length; ++i) {
        let performerSocket: WebSocket | undefined = performers.at(i)?.socket;
        if (performerSocket) {
            performerSocket.send(message);
        }
    }

    // Send to waiting performers
    let waitList: WebSocket[] = currentConcert.waitingPerformers;
    for (let i = 0; i < waitList.length; ++i) {
        let waiterSocket: WebSocket | undefined = waitList.at(i);
        if (waiterSocket) {
            waiterSocket.send(message);
        }
    }

    // Send to Maestro
    let maestro: Performer | undefined = currentConcert.maestro;
    if (maestro) {
        let maestroSocket = maestro.socket;
        if (maestroSocket) {
            maestroSocket.send(message);
        }
    }
}

export { retrieveMessageContents, retrieveHeader, broadcastMessage, signalJoin };