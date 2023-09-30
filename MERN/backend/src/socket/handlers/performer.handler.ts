import WebSocket, { WebSocketServer } from "ws";
import console_log from "../../logging/console_log";
import ConcertParticipant from "../types/socket.participant";
import { outgoingAudioChunkSize, maxAudioBufferSize } from "../socket.config";
import defaultMix from "../mixers/default.mix";
import Concert from "../types/socket.concert";

var ids: number = 0;
var currentConcert: Concert = { performers: [], sockets: [] };
const maxHeaderSize: number = 16;

// Should we store all variables in the router so we can pass them to whatever custom "events" easily?
// Ex., the performers
const addPerformer = function (ws: WebSocket, wss: WebSocketServer) {
    // Initialize new performer object.
    let performer = new ConcertParticipant(ids++); // This id needs to be 100% unique later.
    defineClose(ws, performer);
    defineMessage(ws, performer, wss);
    currentConcert.performers.push(performer);
    currentConcert.sockets.push(ws);

    console_log("New performer added to list: ");
    console_log(currentConcert.performers);
}

const handleMessage = function (ws: WebSocket, data: WebSocket.RawData, wss: WebSocketServer, performer: ConcertParticipant, performers: ConcertParticipant[]) {
    console_log("Received message data: ");
    console_log(data);
    console_log("\n");


    // Store message in Buffer and view through a DataView.
    let buffer: Buffer = Buffer.from(<Buffer>data);
    let thisView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

    receiveAudio(performer, performers, buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), wss);

    // Get the event header in the form of 1 byte characters until the NULL character (0).
    let eventHeader: string = "";
    let isTerminated: boolean = false;
    let nextCharacter: string = String.fromCharCode(thisView.getUint8(0));
    let headerEnd: number = 0;
    for (let i = 0; i < maxHeaderSize && i < thisView.byteLength; ++i) {
        nextCharacter = String.fromCharCode(thisView.getUint8(i));
        if (nextCharacter == String.fromCharCode(0)) {
            headerEnd = i;
            isTerminated = true;
            break;
        }
        eventHeader = eventHeader.concat(nextCharacter);
    }

    /* Waiting for Stephen to make progress before adding another thing,
    // If event name is formatted properly, signal reception.
    if (isTerminated && eventHeader != "") {
        console_log("Detected Event: ");
        console_log(eventHeader);
        console_log("\n");

        // If event exists, pass the data buffer.
        let rawBuffer = buffer.buffer.slice(buffer.byteOffset + headerEnd + 1, buffer.byteOffset + buffer.byteLength);
        console.log(rawBuffer);
        receiveAudio(performer, performers, rawBuffer, wss);
    }
    else {
        console_log("No Event Detected.");
        console_log("\n");
    }
    */
}

const defineMessage = function (ws: WebSocket, performer: ConcertParticipant, wss: WebSocketServer) {
    // Handle messages, including audio data.
    ws.on('message', function message(data) {
        handleMessage(ws, data, wss, performer, currentConcert.performers);

        // If there is enough data in each participant's buffer, mix and send.
        if (validatePerformerBuffers(currentConcert.performers) === true) {
            console_log("Performer buffers validated.");

            let chunkBuffers: Buffer[] = gatherAudioBuffers(currentConcert.performers);
            console_log("Audio buffers gathered.");

            let mixedBuffer: Buffer = defaultMix(chunkBuffers);
            console_log("Audio mixed.");

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(mixedBuffer, { binary: true });
                    console_log("Mixed chunk sent:");
                    console_log(mixedBuffer);
                }
            });

            updatePerformers(currentConcert.performers);
            console_log("\n");
        }

        // Close the connection if the buffer exceeds roughly 10 minutes.
        if (performer.bufferSize > maxAudioBufferSize) {
            ws.close();
        }
    });
}

const defineClose = function (ws: WebSocket, performer: ConcertParticipant) {
    // Identify performer socket and close connection.
    ws.on('close', function message(data) {
        for (let i = 0; i < currentConcert.performers.length; ++i) {
            if (currentConcert.performers.at(i) === performer) {
                ws.close();
                currentConcert.performers.splice(i, 1);
                console_log("Performer removed. Current performers: ");
                console_log(currentConcert.performers);
            }
        }
    });
}

const updatePerformers = function (performers: ConcertParticipant[]): void {
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            performer.bytesProcessed += outgoingAudioChunkSize; // THIS IS NOT GOOD ENOUGH
            performer.bytesLefttoProcess -= outgoingAudioChunkSize;
        }
    }
}

const gatherAudioBuffers = function (performers: ConcertParticipant[]): Buffer[] {
    // Collect participant buffers to pass them to the mixer if they are of the required size.
    let rawBuffers: Buffer[] = [];
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            let chunkStart = performer.audioBuffer.byteOffset + performer.bytesProcessed;
            let chunk = performer.audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingAudioChunkSize);
            rawBuffers.push(Buffer.from(chunk));
        }
    }

    return rawBuffers;
}

const validatePerformerBuffers = function (performers: ConcertParticipant[]): boolean {
    // Make sure there is enough audio data from each participant.
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            if (performer.bytesLefttoProcess < outgoingAudioChunkSize) {
                return false;
            }
        }
    }

    return true;
}

const receiveAudio = function (performer: ConcertParticipant, performers: ConcertParticipant[], rawAudio: ArrayBuffer, wss: WebSocketServer) {
    // Write message contents into user's buffer.
    let thisView = new DataView(rawAudio);
    for (let i = 0; i < thisView.byteLength; ++i) {
        performer.audioBuffer.writeUint8(thisView.getUint8(i), performer.bufferSize);
        performer.bufferSize++;
        performer.bytesLefttoProcess++;
    }

    console_log("Total buffer bytes filled: ");
    console_log(performer.bufferSize);
    console_log("\n");
}

export { addPerformer };