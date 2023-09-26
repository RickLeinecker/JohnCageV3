// Debug
import console_log from "./logging/console_log"

// Basic WebSocket server ensures "ws" protocol or doesn't work.
const http = require('http');
const httpServer = http.createServer();
import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({
    noServer: true
});

// Socket actions --------------------------------
wss.on('connection', function connection(ws, req) {
    console_log("Web socket connection established." + String(req.socket.remoteAddress));

    var audioBuffer: Buffer = Buffer.from("");
    var bytesProcessed = 0;
    var bytesLefttoProcess = 0;
    const outgoingChunkSize = 5000;
    const maxBufferSize = 100000;

    ws.on('message', function message(data) {

        // Recieve audio data
        console_log("Received data: ");
        console_log(data);

        // Update buffer
        audioBuffer = Buffer.concat([audioBuffer, <Buffer>data]);
        bytesLefttoProcess = audioBuffer.length - bytesProcessed;
        console_log("Full Audio Buffer: ");
        console_log(audioBuffer);

        // Test writing to buffer.
        // audioBuffer.writeUInt8(5, 0);
        // console.log(audioBuffer);

        // Broadcast back the audio chunk.
        // wss.clients.forEach(function each(client) {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(data);
        //   }
        // });

        // If the buffer has enough unprocessed data, process it (for now just send it).
        if (bytesLefttoProcess > outgoingChunkSize) {
            let chunkStart = audioBuffer.byteOffset + bytesProcessed;
            let chunk = audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingChunkSize);
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    console.log(chunk);
                    client.send(chunk, { binary: true });
                }
            });
            bytesProcessed += outgoingChunkSize;
        }

        // Close the connection if the buffer gets really big, just to be safe. 
        // This is probably not good enough for saving memory but it will remind the tester.
        if (audioBuffer.length > maxBufferSize) {
            ws.close();
        }
    });
});

export { wss, httpServer };