// Debug
import console_log from "../logging/console_log";

// Types/Classes
import { WebSocket, WebSocketServer } from "ws";
import { Concert } from "./types/socket.concert";
import { IncomingMessage } from "http";

// Functions
import enqueuePerformer from "./events/enqueue.event";
import { addMaestro } from "./handlers/maestro.handler";
import { signalJoin } from "./utilities/socket.binary";

var currentConcert: Concert = { performers: [], maestro: undefined, waitingPerformers: [], active: false };

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);

    if (route.includes("/concert/performer/maestro")) { // Needs to be altered to authenticate a passcode.
        // Authenticate

        let argument = route.split("=");
        signalJoin(currentConcert, argument[1]);

        addMaestro(ws, wss, currentConcert);
        console_log("performer/maestro connected.");
    }
    else if (route.includes("/concert/performer")) {
        // Authenticate

        let argument = route.split("=");
        signalJoin(currentConcert, argument[1]);

        enqueuePerformer(ws, currentConcert);
        console_log("performer connected.");
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate

        let argument = route.split("=");
        signalJoin(currentConcert, argument[1]);

        enqueuePerformer(ws, currentConcert);
        console_log("listener connected.");
    }
    else {
        // This else may be removed once raoutes are confirmed working on the mobile frontend.
        // Authenticate

        let argument = route.split("=");
        signalJoin(currentConcert, argument[1]);

        enqueuePerformer(ws, currentConcert);
        console_log("anonymous connected.");
    }
}

export default routeConnection;