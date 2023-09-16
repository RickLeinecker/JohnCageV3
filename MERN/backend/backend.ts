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

// Socket.io app depending on Express server
const http = require('http');
const socketio = require("socket.io");
const socketServer = http.createServer(expressServerInstance.expressApp);
const socketApp = socketio(socketServer, { cors: { origin: "*" } });
const socketPort = 5001;

socketApp.on('connect', (socket: any) => {

  console_log('Connected');

  socket.emit('greet', { data: 'Greetings from socketServer' });

  socket.on("recording", (chunk: any) => {

    console_log("Audio chunk recieved. Transmitting to frontend...");
    socket.broadcast.emit('listening', chunk);
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







// Backups

// const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// .listen(expressPort, "localhost", function () { Might need this, but didnt before. Backup.