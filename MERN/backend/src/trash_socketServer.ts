import cors, { CorsOptions } from "cors";
import express, { Application } from "express";

class socketServer {
    constructor(app: Application) {
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "*"//Fix using env variable.
        };
    }

    private syncDatabase(): void {
    }
}

export default socketServer;





// Socket.io app depends on Express server

// const socketio = require("socket.io");
// const socketServer = http.createServer(expressServerInstance.expressApp);

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

