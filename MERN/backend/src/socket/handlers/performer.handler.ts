import WebSocket, { WebSocketServer } from "ws";
import console_log from "../../logging/console_log";
import { ConcertParticipant, Performer } from "../types/socket.participant";
import { maxAudioBufferSize } from "../socket.config";
import { Concert } from "../types/socket.concert";
import { receiveAudio } from "../events/receive.event";
import { CustomHeader } from "../types/socket.header";
import { retrieveHeader, retrieveMessageContents } from "../utilities/socket.binary";
import concertTick from "../events/tick.event";

var ids: number = 0;

const addPerformer = function (ws: WebSocket, currentConcert: Concert) {
    // Initialize new performer object.
    let performer: Performer = { data: new ConcertParticipant(ids++), socket: ws }; // This id needs to be 100% unique later.
    currentConcert.performers.push(performer);

    defineClose(performer, currentConcert);
    defineMessage(performer, currentConcert);

    console_log("New performer added to list: ");
    console_log(currentConcert.performers);
}


const defineMessage = function (performer: Performer, currentConcert: Concert) {
    // Handle messages, including audio data.
    performer.socket.on('message', function message(data) {

        console_log("Received message data: ");
        console_log(data);
        console_log("\n");

        let message: Buffer = <Buffer>data;
        let headerData: CustomHeader = retrieveHeader(<Buffer>data);

        let headerEnd: number = headerData.headerEnd;
        let header: string = headerData.header;

        if (header == "") {
            if (headerEnd + 1 < message.byteLength && currentConcert.active == true) {
                receiveAudio(performer, retrieveMessageContents(message, headerEnd));
                concertTick(currentConcert);
                if (performer.data.bufferSize > maxAudioBufferSize) {
                    for (let i = 0; i < currentConcert.performers.length; ++i) {
                        if (currentConcert.performers.at(i) === performer) {
                            currentConcert.performers.splice(i, 1);
                            performer.socket.close();
                            console_log("Performer removed. Current performers: "); // CHECK IF DUPLICATE WITH SOCKET ONCLOSE CODE.
                            console_log(currentConcert.performers);
                            console_log("\n");
                        }
                    }
                }
            }
        }
        else {
            console_log("No event matches the given header: ");
            console_log(header);
            console_log("\n");
        }

        /*
        handleMessage(ws, data, wss, performer, currentConcert.performers);

        concertTick(currentConcert);

        // Close the connection if the buffer exceeds roughly 10 minutes.
        if (performer.data.bufferSize > maxAudioBufferSize) {
            ws.close();
        }
        */
    });
}

const defineClose = function (performer: Performer, currentConcert: Concert) {
    // Identify performer socket and close connection.
    performer.socket.on('close', function message(data) {
        for (let i = 0; i < currentConcert.performers.length; ++i) {
            if (currentConcert.performers.at(i) === performer) {
                currentConcert.performers.splice(i, 1);
                performer.socket.close();
                console_log("Performer removed. Current performers: "); // CHECK IF DUPLICATE WITH SOCKET ONCLOSE CODE.
                console_log(currentConcert.performers);
            }
        }
    });
}

export { addPerformer };











// const handleMessage = function (ws: WebSocket, data: WebSocket.RawData, wss: WebSocketServer, performer: Performer, performers: Performer[]) {
//     console_log("Received message data: ");
//     console_log(data);
//     console_log("\n");

//     let message: Buffer = <Buffer>data;
//     let headerData: CustomHeader = retrieveHeader(<Buffer>data);

//     let headerEnd: number = headerData.headerEnd;
//     let header: string = headerData.header;

//     if (header == "") {
//         // Receive audio.
//     }
//     else if (header == "Stop") {

//     }

//     if (headerEnd + 1 < message.byteLength) {
//         receiveAudio(performer, retrieveMessageContents(message, headerEnd));
//     }

//     /* Waiting for Stephen to make progress before adding another thing,
//     // If event name is formatted properly, signal reception.
//     if (isTerminated && eventHeader != "") {
//         console_log("Detected Event: ");
//         console_log(eventHeader);
//         console_log("\n");

//         // If event exists, pass the data buffer.
//         let rawBuffer = buffer.buffer.slice(buffer.byteOffset + headerEnd + 1, buffer.byteOffset + buffer.byteLength);
//         console.log(rawBuffer);
//         receiveAudio(performer, performers, rawBuffer, wss);
//     }
//     else {
//         console_log("No Event Detected.");
//         console_log("\n");
//     }
//     */
// }