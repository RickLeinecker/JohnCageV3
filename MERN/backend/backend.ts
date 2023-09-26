// Debug
import console_log from "./src/logging/console_log"

// Express API server
import expressServer from "./src/expressServer";
const expressServerInstance: expressServer = new expressServer();
const expressPort = 5000;

expressServerInstance
  .expressApp
  .listen(expressPort, () => console_log(`Express server is listening on port ${expressPort}.`))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console_log("Error: address already in use");
    } else {
      console_log(err);
    }
  });




// Socket.io app depends on Express server
const http = require('http');
const socketio = require("socket.io");
const socketServer = http.createServer(expressServerInstance.expressApp);

// const socketApp = socketio(socketServer, { cors: { origin: "*" } });
// const socketPort = 5001;
// const fs = require("fs");

// socketApp.on('connect', (socket: any) => {

//   console_log('Connected');

//   socket.emit('greet', { data: 'Greetings from socketServer' });

//   socket.on("recording", (response: any) => {
//     console_log("Audio chunk recieved. Transmitting to frontend...");
//     console_log(String(response.chunkId));
//     socket.broadcast.emit('listening', { chunk: response.chunk, chunkId: response.chunkId });

//     if (response.chunkId == 1) {
//       //fs.writeFileSync("backendChunkWebm.webm", response.chunk);
//     }
//   });

//   socket.on('disconnect', () => {
//     console_log('Disconnected');
//   });
// });

// socketServer
//   .listen(socketPort, console_log("Socket app listening on port " + socketPort))
//   .on("error", (err: any) => {
//     if (err.code === "EADDRINUSE") {
//       console_log("Error: address already in use");
//     } else {
//       console_log(err);
//     }
//   });







// Basic WebSocket server ensures "ws" protocol or doesn't work.
const httpServer = http.createServer();
import WebSocket, { WebSocketServer } from "ws";
const webSocketPort = 8080;
const wss = new WebSocketServer({
  noServer: true
});

wss.on('connection', function connection(ws, req) {
  console_log("Web socket connection established." + String(req.socket.remoteAddress));

  ws.on('message', function message(data) {
    // var audioBuffer: Buffer = Buffer.from("");
    // console_log(audioBuffer);

    // console_log("Received data: ");
    // console_log(data);

    // audioBuffer = Buffer.concat([audioBuffer, <Buffer>data]);

    // console_log("Full Audio Buffer: ");
    // console_log(audioBuffer);

    // var dataView = new DataView(audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength));

    // console_log("Dataview: ");
    // console_log(dataView);
    // console.log("Dataview Length: ");
    // console.log(dataView.byteLength);
    // console_log("Dataview 0th UInt8: ");
    // console_log(dataView.getUint8(0));
    // console.log("Dataview 0th UInt16: ");
    // console.log(dataView.getUint16(0, true));


    //ws.send(data)
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

httpServer.on('upgrade', function upgrade(request: any, socket: any, head: any) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

httpServer
  .listen(webSocketPort, console_log("Web socket listening on port " + webSocketPort))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console_log("Error: address already in use");
    } else {
      console_log(err);
    }
  });

// Export express app required for Jest unit testing.
module.exports = { expressServerInstance };




/*
Backup. Should be gone soon.



const https = require('https');
var myServer;

if (process.env.NODE_ENV == "production") {
  myServer = https.createServer({
    key: "/var/www/johncagetribute/auth/server.key",
    cert: "/var/www/johncagetribute/auth/server.cert"
  });
}
else {
  myServer = http.createServer({});
}

import { WebSocketServer } from "ws";
const webSocketPort = 8080;

// const wss = new WebSocketServer({
//   port: webSocketPort,
// });

const wss = new WebSocketServer({
  noServer: true
});

wss.on('connection', function connection(ws) {

  console_log("Web socket connection estasblished.");

  ws.send('reply');

  ws.on('message', function message(data) {
    console_log(data.toString());
  });

});

myServer.on('upgrade', function upgrade(request: any, socket: any, head: any) {

  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });

});

myServer.listen(webSocketPort);
*/




// Backups

// const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// .listen(expressPort, "localhost", function () { Might need this, but didnt before. Backup.
