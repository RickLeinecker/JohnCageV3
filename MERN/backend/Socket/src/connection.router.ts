// Debug
import console_log from "../../functions/logging/console_log";

// Types/Classes
import { WebSocket, WebSocketServer } from "ws";
import { Concert } from "./socket.types";
import { IncomingMessage } from "http";

// Functions
import enqueuePerformer from "./events/internal/enqueue.event";
import { addMaestro } from "./handlers/maestro.handler";
import { broadcastNames } from "./events/outgoing/names.broadcast";
import { getDateUTC, getTimeUTC, floorTime } from "../../functions/date.functions";

const fs = require("fs");

var currentConcert: Concert = {
    performers: [],
    maestro: undefined,
    waitingPerformers: [],
    active: false,
    mixedAudio: Buffer.alloc(2),
    listener: undefined
};

const validateDateTime = function (): boolean {
    let date = getDateUTC();
    let time = floorTime(getTimeUTC());
    let dateTime = date + "T" + time;

    const dateTimeScheduled = fs.readFileSync("../temp/timestamp", "utf8", (err: any, data: any) => {
        if (err) { console_log("Error reading timestamp: ", err, "\n"); }
        console_log("Timestamp DateTime: ", data);
        console_log("Current: ", dateTime);
        console_log("Comparison: ", (dateTime == data));
    });

    if (dateTime == dateTimeScheduled) { return true; }

    console.log("AAAAAA")

    return false;
}

const validatePasscode = function (passcode: string): boolean {
    console.log("BBBBBB")

    const passcodes = fs.readdirSync("../temp/passcodes/");
    console_log("Passcodes: ", passcodes, "\n");

    if (passcodes.includes(passcode)) { return true; }
    return false;
}

const validateConnection = function (passcode: string): boolean {
    if (validateDateTime() && validatePasscode(passcode)) { return true; }
    return false;
}

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    let route = String(req.url);

    if (route.includes("/concert/performer/maestroINSECURE")) {
        let argument = route.split("=");

        addMaestro(ws, currentConcert, argument[1]);
        console_log("performer/maestroINSECURE connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/performer/maestro")) {
        let argument = route.split("=");

        // Authenticate
        if (!validateConnection(argument[3])) {
            ws.close();
        }
        else {
            addMaestro(ws, currentConcert, argument[1]);
            console_log("performer/maestro connected.");
            broadcastNames(currentConcert);
        }
    }
    else if (route.includes("/concert/performerINSECURE")) {
        let argument = route.split("=");

        enqueuePerformer(ws, currentConcert, argument[1]);
        console_log("performer connected.");
        broadcastNames(currentConcert);
    }
    else if (route.includes("/concert/performer")) {
        let argument = route.split("=");

        // Authenticate
        if (!validateConnection(argument[3])) {
            ws.close();
        }
        else {
            enqueuePerformer(ws, currentConcert, argument[1]);
            console_log("performerSECURE connected.");
            broadcastNames(currentConcert);
        }
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate first
        let argument = route.split("=");

        // Authenticate
        if (!validateConnection(argument[3])) {
            ws.close();
        }
        else {
            console_log("listener connected.");
            broadcastNames(currentConcert);
        }
    }
    else {
        console_log("Anonymous connected.");
        console_log("Closing anonymous connection.");
        ws.close();
    }
}

export default routeConnection;