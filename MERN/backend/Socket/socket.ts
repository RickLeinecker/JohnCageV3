// Web Socket Server using "ws" nodejs module.
// Http server required for initial ws:// protocol handshake.
const http = require('http');
const httpServer = http.createServer();
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ noServer: true });

import routeConnection from "./src/connection.router";
import console_log from "../functions/logging/console_log";
const webSocketPort = 8080;

wss.on('connection', (ws, req) => {
  console_log("Web socket connection established.");
  routeConnection(ws, req, wss);
});

httpServer.on('upgrade', (request: any, socket: any, head: any) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

httpServer
  .listen(webSocketPort, console_log("Web socket listening on port " + webSocketPort + "."))
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") { console_log("Error: address already in use."); }
    else { console_log(err); }
  });
