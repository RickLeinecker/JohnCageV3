// Debug
import console_log from "./logging/console_log";
import console_err from "./logging/console_err";

// Web Socket Server using "ws" nodejs module.
// Http server required for initial ws:// protocol handshake.
const http = require('http');
const httpServer = http.createServer();
import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ noServer: true });

// Custom modules
import routeConnection from "./socket/routers/connection.router";

// Socket actions --------------------------------
wss.on('connection', function connection(ws, req) {
    // Connection Steps: 
    // Authenticate or Reject.
    // Classify connection type and initialize.
    console_log("Web socket connection established.");

    routeConnection(ws, req, wss);
});

export { wss, httpServer };