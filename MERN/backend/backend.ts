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
const socketApp = socketio(socketServer, { cors: { origin: "*" } });
const socketPort = 5001;
const fs = require("fs");

socketApp.on('connect', (socket: any) => {

  console_log('Connected');

  socket.emit('greet', { data: 'Greetings from socketServer' });

  socket.on("recording", (response: any) => {
    console_log("Audio chunk recieved. Transmitting to frontend...");
    console_log(String(response.chunkId));
    socket.broadcast.emit('listening', { chunk: response.chunk, chunkId: response.chunkId });

    if (response.chunkId == 1) {
      fs.writeFileSync("backendChunkWebm.webm", response.chunk);
    }
  });

  socket.on('disconnect', () => {
    console_log('Disconnected');
  });
});

socketServer
  .listen(socketPort, console_log("Socket app listening on port " + socketPort))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console_log("Error: address already in use");
    } else {
      console_log(err);
    }
  });

// Export express app required for Jest unit testing.
module.exports = { expressServerInstance, socketApp };




// Basic WebSocket server ensures "ws" protocol or doesn't work.
import { WebSocketServer } from "ws";
const webSocketPort = 8080;

const wss = new WebSocketServer({
  port: webSocketPort,
});

wss.on('connection', function connection(ws) {

  console_log("Web socket connection estasblished.");

  ws.send('reply');

  ws.on('message', function message(data) {
    console_log(data.toString());
  });

});










// Backups

// const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// .listen(expressPort, "localhost", function () { Might need this, but didnt before. Backup.