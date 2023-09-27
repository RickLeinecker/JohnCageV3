// Debug
import console_log from "./logging/console_log"

// Basic WebSocket server ensures "ws" protocol or doesn't work.
const http = require('http');
const httpServer = http.createServer();
import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ noServer: true });
import { outgoingAudioChunkSize, maxAudioBufferSize } from "./socket/socket.config";
import ConcertParticipant from "./socket/socket.participant";


// Global list of connected performers.
var performers: ConcertParticipant[] = [];
var ids: number = 0;


// Socket actions --------------------------------
wss.on('connection', function connection(ws, req) {

    console_log("Web socket connection established." + String(req.socket.remoteAddress));

    test();

    // Initialize new performer object.
    // This id needs to be 100% unique later.
    let performer = new ConcertParticipant(ws, ids);
    performers.push(performer);
    ids++;
    console_log("New performer added to list: ");
    console_log(performers);

    // Set performer socket behaviour.
    performer.socket.on('close', function message(data) {
        // Identify performer socket and close connection.
        for (let i = 0; i < performers.length; ++i) {
            if (performers.at(i) === performer) {
                performer.socket.close();
                performers.splice(i, 1);
                console_log("Performer removed. Current performers: ");
                console_log(performers);
            }
        }
    });

    performer.socket.on('message', function message(data) {
        // Receive audio data
        console_log("Received message data: ");
        console_log(data);

        // Update buffer
        performer.audioBuffer = Buffer.concat([performer.audioBuffer, <Buffer>data]);
        performer.bytesLefttoProcess = performer.audioBuffer.length - performer.bytesProcessed;
        console_log("Full audio buffer byte size: ");
        console_log(performer.audioBuffer.byteLength);

        // If there is enough data in each participant's buffer, mix and send.
        if (validatePerformerBuffers(performers) === true) {
            console_log("Performer buffers validated.");

            let chunkBuffers: Buffer[] = gatherAudioBuffers(performers);
            console_log("Audio buffers gathered.");

            let mixedBuffer: Buffer = mix(chunkBuffers);
            console_log("Audio mixed.");

            handlePerformers(performers);

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(mixedBuffer, { binary: true });
                    console_log("Mixed chunk sent:");
                    console_log(mixedBuffer);
                }
            });
        }

        // Close the connection if the buffer exceeds roughly 10 minutes.
        if (performer.audioBuffer.length > maxAudioBufferSize) {
            performer.socket.close();
        }
    });

});


const test = function () {
    let myarraybuffer: Int8Array = new Int8Array([-128, 0, 5, 40]);
    let mynicebuff: Buffer = Buffer.from(myarraybuffer);
    let myarraybuffer2: Int8Array = new Int8Array([127, 255, 5, 40]);
    let mynicebuff2: Buffer = Buffer.from(myarraybuffer2);
    console.log(mynicebuff);
    console.log(mynicebuff2);
    console.log(mynicebuff.byteLength);
    let mynicearray: Buffer[] = [mynicebuff, mynicebuff2];

    console.log(mix(mynicearray));
}

const handlePerformers = function (performers: ConcertParticipant[]): void {
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            performer.bytesProcessed += outgoingAudioChunkSize; // THIS IS NOT GOOD ENOUGH
        }
    }
}

const gatherAudioBuffers = function (performers: ConcertParticipant[]): Buffer[] {
    // Collect participant buffers and pass them to the mixer if they are of the required size.
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

const mix = function (buffers: Buffer[]): Buffer {
    let mixedAudio: Buffer = Buffer.alloc(outgoingAudioChunkSize);

    // Error checking: all buffers should be same size.
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer == undefined || buffer.byteLength != outgoingAudioChunkSize) {
            console_log("Error: Buffer not correct size, or it doesn't exist: ");
            console_log(buffers.at(i));
            return mixedAudio;
        }
    }

    // Create data views from buffers to 16 bit calculations.
    let bufferViews: DataView[] = [];
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer != undefined) {
            let newView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
            bufferViews.push(newView);
        }
    }

    // Mix samples: Add all samples together and divide by the number of samples.
    for (let i = 0; i < outgoingAudioChunkSize / 2; ++i) {
        var sum = 0;
        var samples = 0;
        for (let j = 0; j < bufferViews.length; ++j) {
            let view = bufferViews.at(j);
            if (view != undefined) {
                samples++;
                sum += 32768 + view.getInt16(2 * i, false);
            }
        }

        mixedAudio.writeInt16BE((sum / samples) - 32768, 2 * i);
    }

    return mixedAudio;
}


export { wss, httpServer };




// // If the buffer has enough unprocessed data, process it (for now just send it).
// if (performer.bytesLefttoProcess > outgoingAudioChunkSize) {
//     let chunkStart = performer.audioBuffer.byteOffset + performer.bytesProcessed;
//     let chunk = performer.audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingAudioChunkSize);
//     wss.clients.forEach(function each(client) {
//         if (client.readyState === WebSocket.OPEN) {
//             console_log("Processing (sending) chunk: ");
//             console_log(chunk);
//             client.send(chunk, { binary: true });
//         }
//     });
//     performer.bytesProcessed += outgoingAudioChunkSize;
// }





// let mynicebuff: Buffer = Buffer.from([0x00, 0x10, 0x02, 0x02]);

// console.log("Huh?", mynicebuff.buffer.byteLength);

// Test writing to buffer.
// audioBuffer.writeUInt8(5, 0);
// console.log(audioBuffer);

// Broadcast back the audio chunk.
// wss.clients.forEach(function each(client) {
//   if (client.readyState === WebSocket.OPEN) {
//     client.send(data);
//   }
// });