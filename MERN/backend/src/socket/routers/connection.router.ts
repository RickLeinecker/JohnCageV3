import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { addPerformer } from "../handlers/performer.handler";

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = req.url;
    if (route == "/concert/performer") { // Needs to be altered to authenticate a passcode.
        addPerformer(ws, wss);
    }
}

export default routeConnection;