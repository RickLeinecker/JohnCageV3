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

        // If the buffer has enough unprocessed data, process it (for now just send it).
        if (performer.bytesLefttoProcess > outgoingAudioChunkSize) {
            let chunkStart = performer.audioBuffer.byteOffset + performer.bytesProcessed;
            let chunk = performer.audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingAudioChunkSize);
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    console_log("Processing (sending) chunk: ");
                    console_log(chunk);
                    client.send(chunk, { binary: true });
                }
            });
            performer.bytesProcessed += outgoingAudioChunkSize;
        }

        // Close the connection if the buffer exceeds roughly 10 minutes.
        if (performer.audioBuffer.length > maxAudioBufferSize) {
            performer.socket.close();
        }
    });

});

export { wss, httpServer };






// Test writing to buffer.
// audioBuffer.writeUInt8(5, 0);
// console.log(audioBuffer);

// Broadcast back the audio chunk.
// wss.clients.forEach(function each(client) {
//   if (client.readyState === WebSocket.OPEN) {
//     client.send(data);
//   }
// });