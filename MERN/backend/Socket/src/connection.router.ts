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

const defaultPasscode: string = "None";

var currentConcert: Concert = {
    performers: [],
    maestro: undefined,
    waitingPerformers: [],
    active: false,
    mixedAudio: Buffer.alloc(2),
    listener: undefined,
    attendance: {},
    activePasscodes: []
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

const validatePerformerPasscode = function (passcode: string): boolean {
    console_log("Validating performer passcode...");

    const passcodes = fs.readdirSync("../temp/passcodes/performers/") ? fs.readdirSync("../temp/passcodes/performers/") : [];
    console_log("Passcodes: ", passcodes, "\n");

    if (passcodes.includes(passcode)) { return true; }
    console_log("Passcode not valid.");

    return false;
}

const validateMaestroPasscode = function (passcode: string): boolean {
    console_log("Validating maestro passcode...");

    const passcodes = fs.readdirSync("../temp/passcodes/maestro/") ? fs.readdirSync("../temp/passcodes/maestro/") : [];
    console_log("Maestro passcodes: ", passcodes, "\n");

    if (passcodes.includes(passcode)) { return true; }

    console_log("Passcode not valid.");
    return false;
}

const routeConnection = function (ws: WebSocket, req: IncomingMessage, wss: WebSocketServer) {
    const route = String(req.url);

    if (route.includes("/concert/performer/maestro")) {
        const argument = route.split("=");
        const passcode: string = argument.at(3) ? argument.at(3) as string : defaultPasscode;
        const nickname: string = argument.at(1) ? argument.at(1) as string : "Maestro";

        // Authenticate
        if (!(validateDateTime() && validateMaestroPasscode(passcode) && !currentConcert.activePasscodes.includes(passcode))) {
            ws.close();
        }
        else {
            currentConcert.activePasscodes.push(passcode);
            addMaestro(ws, currentConcert, nickname, passcode);
            currentConcert.attendance[passcode] = "Maestro: " + nickname;
            console_log("performer/maestro connected.");
            broadcastNames(currentConcert);
        }
    }
    else if (route.includes("/concert/performer")) {
        const argument = route.split("=");
        const passcode: string = argument.at(3) ? argument.at(3) as string : defaultPasscode;
        const nickname: string = argument.at(1) ? argument.at(1) as string : "Performer";

        // Authenticate
        if (!(validateDateTime() && validatePerformerPasscode(passcode) && !currentConcert.activePasscodes.includes(passcode))) {
            ws.close();
        }
        else {
            currentConcert.activePasscodes.push(passcode);
            enqueuePerformer(ws, currentConcert, nickname, passcode);
            currentConcert.attendance[passcode] = "Performer: " + nickname;
            console_log("performer connected.");
            broadcastNames(currentConcert);
        }
    }
    else if (route.includes("/concert/listener")) {
        // Authenticate first
        const argument = route.split("=");
        const passcode: string = argument.at(3) ? argument.at(3) as string : defaultPasscode;
        const nickname: string = argument.at(1) ? argument.at(1) as string : "Listener";

        // Authenticate
        if (false) {
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