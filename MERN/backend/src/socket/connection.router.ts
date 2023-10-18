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

const fs = require("fs");
const WaveFile = require("wavefile").WaveFile;

var currentConcert: Concert = { performers: [], maestro: undefined, waitingPerformers: [], active: false, mixedAudio: Buffer.alloc(2) };

const validatePasscode = function (passcode: string): boolean {
    const passcodes = fs.readdirSync("./temp/passcodes/");
    console_log("Passcodes: ", passcodes, "\n");

    if (passcodes.includes(passcode)) { return true; }
    return false;
}

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);

    if (route.includes("/concert/performer/maestro")) {
        // Authenticate first

        let argument = route.split("=");

        addMaestro(ws, currentConcert, argument[1]);
        console_log("performer/maestro connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/performer")) {
        let argument = route.split("=");

        enqueuePerformer(ws, currentConcert, argument[1]);
        console_log("performer connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/performerSECURE")) {
        let argument = route.split("=");

        // Authenticate
        if (!validatePasscode(argument[3])) {
            ws.close(0, "Invalid passcode.");
        }
        else {
            enqueuePerformer(ws, currentConcert, argument[1]);
            console_log("performerSECURE connected.");
            broadcastNames(currentConcert);
        }
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate first

        // // Save raw audio to file.
        // const data = fs.readFileSync("./temp/serverStephenSample");
        // console_log(data, "\n");

        // const buf = Buffer.from(data);
        // const ar16 = new Int16Array(buf.buffer, buf.byteOffset, buf.byteLength / Int16Array.BYTES_PER_ELEMENT);


        // // Convert raw audio file to wav. 
        // let wav = new WaveFile();
        // wav.fromScratch(1, 32000, '16', ar16);
        // const fileName: string = Math.floor((Math.random() * 800000) + 100000).toString() + ".wav";
        // fs.writeFileSync("./music/" + fileName, wav.toBuffer());


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