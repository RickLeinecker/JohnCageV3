import WebSocket, { WebSocketServer } from "ws";
import console_log from "../../logging/console_log";
import { ConcertParticipant } from "../types/socket.participant";
import { outgoingAudioChunkSize, maxAudioBufferSize } from "../socket.config";
import defaultMix from "../mixers/default.mix";
import { Concert } from "../types/socket.concert";
import { maxCustomHeaderSize } from "../socket.config";

import { receiveAudio } from "../events/receive.event";
import { addPerformer } from "./performer.handler";
import { retrieveMessageContents, retrieveHeader } from "../utilities/socket.binary";
import { CustomHeader } from "../types/socket.header";
import { Performer } from "../types/socket.participant";

import beginConcert from "../events/begin.event";
import enqueuPerformer from "../events/enqueue.event";
import concertTick from "../events/tick.event";


const addMaestro = function (ws: WebSocket, wss: WebSocketServer, currentConcert: Concert) {
    currentConcert.active = false; // VERY TEMPORARY, DO NOT LEAVE ALONE

    let maestro: Performer = { data: new ConcertParticipant(-1), socket: ws }; // This id needs to be 100% unique later.
    //defineClose(ws, maestro);
    defineMessage(ws, maestro, wss, currentConcert);
    currentConcert.maestro = maestro;

    console_log("Maestro joined concert: ");
    console_log(currentConcert.maestro);
    console_log("\n");
}

const defineMessage = function (ws: WebSocket, performer: Performer, wss: WebSocketServer, currentConcert: Concert) {
    // Handle messages, including audio data.
    ws.on('message', function message(data) {
        console_log("Received message data: ");
        console_log(data);
        console_log("\n");

        let message: Buffer = <Buffer>data;
        let headerData: CustomHeader = retrieveHeader(<Buffer>data);

        let headerEnd: number = headerData.headerEnd;
        let header: string = headerData.header;

        if (header == "") {
            if (headerEnd + 1 < message.byteLength && currentConcert.active == true) {
                let maestro = currentConcert.maestro;
                if (maestro) {
                    receiveAudio(maestro, retrieveMessageContents(message, headerEnd));
                    concertTick(currentConcert);
                    if (maestro.data.bufferSize > maxAudioBufferSize) {
                        maestro.socket.close();
                        console_log("Maestro removed. Current performers: ");
                        console_log(currentConcert.performers);
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

export { addMaestro };
