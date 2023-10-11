// Debug
import console_log from "../../logging/console_log";

// Globals
import { maxAudioBufferSize } from "../socket.config";

// Types/Classes
import WebSocket, { WebSocketServer } from "ws";
import { CustomHeader, Performer, Concert, ConcertParticipant } from "../socket.types";

// Functions
import beginConcert from "../events/begin.event";
import concertTick from "../events/tick.event";
import { receiveAudio } from "../events/receive.event";
import { retrieveMessageContents, retrieveHeader } from "../utilities/socket.binary";

const addMaestro = function (ws: WebSocket, currentConcert: Concert, name: string) {
    currentConcert.active = false; // VERY TEMPORARY, DO NOT LEAVE ALONE

    let maestro: Performer = { data: new ConcertParticipant(-1), socket: ws, nickname: name }; // This id needs to be 100% unique later.
    //defineClose(ws, maestro);
    defineMaestroMessage(ws, currentConcert);
    defineMaestroClose(ws, currentConcert);
    currentConcert.maestro = maestro;

    console_log("Maestro joined concert: ");
    console_log(currentConcert.maestro);
    console_log("\n");
}

const defineMaestroMessage = function (ws: WebSocket, currentConcert: Concert) {
    // Handle messages, including audio data.
    ws.on('message', function message(data) {
        console_log("Received message data: ");
        console_log(data);
        console_log("\n");

        let message: Buffer = <Buffer>data;
        let headerData: CustomHeader = retrieveHeader(<Buffer>data);

        let headerEnd: number = headerData.headerEnd;
        let header: string = headerData.header;

        // Receive audio event. Empty header for maximum performance.
        if (header == "") {
            if (headerEnd + 1 < message.byteLength && currentConcert.active == true) {
                let maestro = currentConcert.maestro;
                if (maestro) {
                    receiveAudio(maestro, retrieveMessageContents(message, headerEnd));
                    concertTick(currentConcert);
                    if (maestro.data.bufferSize > maxAudioBufferSize) {
                        maestro.socket.close();
                        removeMaestro(currentConcert);
                    }
                }
            }
        }
        else if (header == "Start") {
            beginConcert(currentConcert);
        }
        else {
            console_log("No Event Matches the Given Header: ");
            console_log(header);
            console_log("\n");
        }
    });
}

const defineMaestroClose = function (ws: WebSocket, currentConcert: Concert) {
    let maestroSocket: WebSocket | undefined = currentConcert.maestro?.socket;

    if (maestroSocket) {
        maestroSocket.on('close', function message(data) {
            removeMaestro(currentConcert);
        });
    }
}

const removeMaestro = function (currentConcert: Concert) {
    currentConcert.maestro = undefined;
    console_log("Maestro removed."); // CHECK IF DUPLICATE WITH SOCKET ONCLOSE CODE.
    console_log(currentConcert.maestro);
}

export { addMaestro };
