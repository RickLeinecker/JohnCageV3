// Debug
import console_log from "../logging/console_log";

// Types/Classes
import { WebSocket, WebSocketServer } from "ws";
import { Concert } from "./socket.types";
import { IncomingMessage } from "http";

// Functions
import enqueuePerformer from "./events/internal/enqueue.event";
import { addMaestro } from "./handlers/maestro.handler";
import { broadcastNames } from "./events/outgoing/names.broadcast";

var currentConcert: Concert = { performers: [], maestro: undefined, waitingPerformers: [], active: false };

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);

    if (route.includes("/concert/performer/maestro")) { // Needs to be altered to authenticate a passcode.
        // Authenticate first

        let argument = route.split("=");

        addMaestro(ws, currentConcert, argument[1]);
        console_log("performer/maestro connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/performer")) {
        // Authenticate first

        let argument = route.split("=");

        enqueuePerformer(ws, currentConcert, argument[1]);
        console_log("performer connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate first

        // let argument = route.split("=");

        // enqueuePerformer(ws, currentConcert, argument[1]);
        // broadcastNames(currentConcert);
        // console_log("listener connected.");
    }
    else {
        // This else may be removed once routes are confirmed working on the mobile frontend.
        // Authenticate first

        // let argument = route.split("=");

        // enqueuePerformer(ws, currentConcert, argument[1]);
        // broadcastNames(currentConcert);
        console_log("Anonymous connected.");
        console_log("Closing anonymous connection.");
        ws.close();
    }
}

export default routeConnection;