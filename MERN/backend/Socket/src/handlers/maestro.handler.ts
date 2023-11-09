// Debug
import console_log from "../../../functions/logging/console_log";

// Globals
import { maxAudioBufferSize } from "../../config/socket.config";

// Types/Classes
import WebSocket, { WebSocketServer } from "ws";
import { CustomHeader, Performer, Concert, ConcertParticipant } from "../socket.types";

// Functions
import beginConcert from "../events/internal/begin.event";
import endConcert from "../events/internal/end.event";
import { concertTick } from "../events/internal/tick.event";
import { receiveAudio } from "../events/internal/receive.event";
import { retrieveMessageContents, retrieveHeader } from "../utilities/socket.binary";
import { broadcastStart } from "../events/outgoing/start.broadcast";
import { broadcastStop } from "../events/outgoing/stop.broadcast";
import { removePasscode } from "../functions/removepasscode";

const addMaestro = function (ws: WebSocket, currentConcert: Concert, name: string, passcode: string) {
    currentConcert.active = false; // VERY TEMPORARY, DO NOT LEAVE ALONE

    let maestro: Performer = { passcode: passcode, data: new ConcertParticipant(-1), socket: ws, nickname: name }; // This id needs to be 100% unique later.
    currentConcert.maestro = maestro;
    defineMaestroMessage(ws, currentConcert);
    defineMaestroClose(ws, currentConcert);

    console_log("Maestro joined concert: ");
    console_log(currentConcert.maestro);
    console_log("\n");
}

const defineMaestroMessage = function (ws: WebSocket, currentConcert: Concert) {
    // Handle messages, including audio data.
    ws.on('message', function message(data) {
        //console_log("Received message data: ", data, "\n");

        let message: Buffer = <Buffer>data;
        let headerData: CustomHeader = retrieveHeader(message);

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
        else if (header == "start") {
            if (!currentConcert.active) {
                beginConcert(currentConcert);
                broadcastStart(currentConcert);
            }
        }
        else if (header == "stop") {
            if (currentConcert.active) {
                broadcastStop(currentConcert);
                endConcert(currentConcert);
            }
        }
        else {
            console_log("No Event Matches the Given Header: ", header, "\n");
        }
    });
}

const defineMaestroClose = function (ws: WebSocket, currentConcert: Concert) {
    const maestro: Performer | undefined = currentConcert.maestro;
    if (maestro) {
        const maestroSocket: WebSocket | undefined = maestro.socket;
        maestroSocket.on('close', function message(data) {
            removePasscode(currentConcert, maestro.passcode);
            removeMaestro(currentConcert);
        });
    }
}

const removeMaestro = function (currentConcert: Concert) {
    currentConcert.maestro = undefined;
    console_log("Maestro removed.");
    console_log(currentConcert.maestro);
}

export { addMaestro };
