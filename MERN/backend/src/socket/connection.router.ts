import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { addPerformer } from "./handlers/performer/performer.handler";

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);
    if (route.includes("/concert/performer/maestro")) { // Needs to be altered to authenticate a passcode.
        addPerformer(ws, wss);
        console.log("performer/maestro");
    }
    else if (route.includes("/concert/performer")) {
        addPerformer(ws, wss);
        console.log("performer");
    }
    else if (route.includes("/concert/listener")) {
        addPerformer(ws, wss);
        console.log("listener");
    }

}

export default routeConnection;