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
    console_log("Validating datetime...");

    let date = getDateUTC();
    let time = floorTime(getTimeUTC());
    let dateTime = date + "T" + time;
    const path = "../temp/timestamp";
    const dateTimeStamp: any = fs.existsSync(path) ? fs.readFileSync(path).toString() : "";

    if (dateTimeStamp == "") { console_log("Error reading timestamp.\n"); }
    console_log("Timestamp DateTime: ", dateTimeStamp);
    console_log("Current: ", dateTime);
    console_log("Comparison: ", (dateTime == dateTimeStamp));

    if (dateTime == dateTimeStamp) { return true; }

    console_log("Rejected: Date Time stamp not same as current time slot.");

    return false;
}

const validatePasscode = function (passcode: string): boolean {
    console_log("Validating passcode...");

    const passcodes = fs.readdirSync("../temp/passcodes/") ? fs.readdirSync("../temp/passcodes/") : [];
    console_log("Passcodes: ", passcodes, "\n");

    if (passcodes.includes(passcode)) { return true; }
    console_log("Password not valid.");

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
        console_log("performerINSECURE connected.");
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
            console_log("performer connected.");
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