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
// Express API server  --------------------


// WebSocket Server  ----------------------
import { wss, httpServer } from "./src/webSocketServer";
const webSocketPort = 8080;

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
// WebSocket Server  ----------------------


// Export express app required for Jest unit testing.
module.exports = { expressServerInstance };
















/*
Backup. Should be gone soon.

    // Dataview appears to not be modified when modifying the buffer it was made from.
    var dataView = new DataView(audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength));

    console_log("Dataview: ");
    console_log(dataView);
    console.log("Dataview Length: ");
    console.log(dataView.byteLength);
    console_log("Dataview 0th UInt8: ");
    console_log(dataView.getUint8(0));
    console.log("Dataview 0th UInt16: ");
    console.log(dataView.getUint16(0, true));










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
