// Debug
import console_log from "./logging/console_log"

// Basic WebSocket server ensures "ws" protocol or doesn't work.
const fs = require("fs");
const http = require('http');
const httpServer = http.createServer();
import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ noServer: true });
import { outgoingAudioChunkSize, maxAudioBufferSize } from "./socket/socket.config";
import ConcertParticipant from "./socket/socket.participant";
import console_err from "./logging/console_err";



// Global list of connected performers.
var performers: ConcertParticipant[] = [];
var ids: number = 0;


// Socket actions --------------------------------
wss.on('connection', function connection(ws, req) {

    console_log("Web socket connection established." + String(req.socket.remoteAddress));

    let counter = 0;
    testMixer();

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
        // Receive audio data.
        console_log("Received message data: ");
        console_log(data);
        console_log("\n");

        // Write message contents into user's buffer.
        let thisBuffer = Buffer.from(<Buffer>data);
        let thisView = new DataView(thisBuffer.buffer.slice(thisBuffer.byteOffset, thisBuffer.byteOffset + thisBuffer.byteLength));
        for (let i = 0; i < thisView.byteLength; ++i) {
            performer.audioBuffer.writeUint8(thisView.getUint8(i), performer.bufferSize);
            performer.bufferSize++;
            performer.bytesLefttoProcess++;
        }
        console_log("Total buffer bytes filled: ");
        console_log(performer.bufferSize);
        console_log("\n");


        // If there is enough data in each participant's buffer, mix and send.
        if (validatePerformerBuffers(performers) === true) {
            console_log("Performer buffers validated.");

            let chunkBuffers: Buffer[] = gatherAudioBuffers(performers);
            console_log("Audio buffers gathered.");

            let mixedBuffer: Buffer = mix(chunkBuffers);
            console_log("Audio mixed.");

            // Trying to write raw data to file for analyzing in audacity.
            if (counter % 4 == 3) {
                var err_file = fs.createWriteStream(__dirname + '/mixedBytes', { flags: 'w' });
                err_file.write(mixedBuffer);
            }
            counter++;
            // ----------------------------------------------------------

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(mixedBuffer, { binary: true });
                    console_log("Mixed chunk sent:");
                    console_log(mixedBuffer);
                }
            });

            updatePerformers(performers);
            console_log("\n");
        }

        // Close the connection if the buffer exceeds roughly 10 minutes.
        if (performer.bufferSize > maxAudioBufferSize) {
            performer.socket.close();
        }
    });

});

const printAllBuffers = function (performers: ConcertParticipant[]): void {
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            console.log("Performer " + i + ":", performer.audioBuffer);
        }
    }
}

const testMixer = function () {
    // Test data
    let myarraybuffer: Int8Array = new Int8Array([-128, 0, 5, 40]);
    let mynicebuff: Buffer = Buffer.from(myarraybuffer);
    let myarraybuffer2: Int8Array = new Int8Array([127, 255, 5, 40]);
    let mynicebuff2: Buffer = Buffer.from(myarraybuffer2);
    console.log(mynicebuff);
    console.log(mynicebuff2);
    console.log(mynicebuff.byteLength);
    let mynicearray: Buffer[] = [mynicebuff, mynicebuff2];

    // Mixer
    console.log(mix(mynicearray));
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

const mix = function (buffers: Buffer[]): Buffer {
    let mixedAudio: Buffer = Buffer.alloc(outgoingAudioChunkSize);

    // Error checking: all buffers should be same size.
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer == undefined || buffer.byteLength != outgoingAudioChunkSize) {
            console_log("Error: Buffer not correct size, or it doesn't exist: ");
            console_log(buffers.at(i));
            console_err("Error: Buffer not correct size, or it doesn't exist: ");
            console_err(buffers.at(i));
            return mixedAudio;
        }
    }

    var err_file = fs.createWriteStream(__dirname + '/bufferBytes', { flags: 'w' });
    err_file.write(buffers.at(0));

    // Create data views from buffers to do 16 bit calculations.
    let bufferViews: DataView[] = [];
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer != undefined) {
            let newView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
            bufferViews.push(newView);
        }
    }

    // Mix samples: Add all samples together and divide by the number of samples.
    let sampleCount = bufferViews.length;
    for (let i = 0; i < outgoingAudioChunkSize / 2; ++i) {
        var sampleSum: number = 0;
        for (let j = 0; j < sampleCount; ++j) {
            let view = bufferViews.at(j);
            if (view != undefined) {
                sampleSum += (32768 + view.getInt16(2 * i, false)) / sampleCount;
            }
        }

        mixedAudio.writeInt16BE((sampleSum - 32768), 2 * i);
        // Test if returns undefined with too big number.
        // Test if casting number works.
        // Test if the number can be calculated based on the size of the sample to avoid too big.
        // Print number to ensure it is correct.
        // Try printing typeof to confirm it is 16 bit as expected.
        // Save data to file to check in hex editor.
    }

    return mixedAudio;
}

export { wss, httpServer };


// This was my original way of adding the buffer. I am not sure if concat is memory safe (overlapping).

// I switched to using alloc(max size) in the Concert Participant constructor to avoid these potential problems.
// Old way: performer.audioBuffer = Buffer.concat([performer.audioBuffer, <Buffer>data]);



// Old broadcast without functions for validation, mixing.

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