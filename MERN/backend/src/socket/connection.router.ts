import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { addPerformer } from "./handlers/performer.handler";
import { addMaestro } from "./handlers/maestro.handler";
import console_log from "../logging/console_log";
import { Concert } from "./types/socket.concert";
import { ConcertParticipant } from "./types/socket.participant";
import enqueuePerformer from "./events/enqueue.event";

var currentConcert: Concert = { performers: [], maestro: undefined, waitingPerformers: [], active: false };

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);
    if (route.includes("/concert/performer/maestro")) { // Needs to be altered to authenticate a passcode.
        // Authenticate
        addMaestro(ws, wss, currentConcert);
        console_log("performer/maestro connected.");
    }
    else if (route.includes("/concert/performer")) {
        // Authenticate
        enqueuePerformer(ws, currentConcert);
        //addPerformer(ws, currentConcert, wss);
        console_log("performer connected.");
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate
        enqueuePerformer(ws, currentConcert);
        //addPerformer(ws, currentConcert, wss);
        console_log("listener connected.");
    }
    else {
        // Authenticate
        enqueuePerformer(ws, currentConcert);
        //addPerformer(ws, currentConcert, wss);
        console_log("anonymous connected.");
    }
}

export default routeConnection;