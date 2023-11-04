// Debug
import console_log from "../../../functions/logging/console_log";

// Globals
import { maxAudioBufferSize } from "../../config/socket.config";

// Types/Classes
import WebSocket, { WebSocketServer } from "ws";
import { CustomHeader } from "../socket.types";
import { ConcertParticipant, Performer } from "../socket.types";
import { Concert } from "../socket.types";

// Functions
import { concertTick } from "../events/internal/tick.event";
import { receiveAudio } from "../events/internal/receive.event";
import { retrieveHeader, retrieveMessageContents } from "../utilities/socket.binary";

var ids: number = 0;

const addPerformer = function (ws: WebSocket, currentConcert: Concert, name: string, passcode: string) {
    // Initialize new performer object.
    let performer: Performer = { passcode: passcode, data: new ConcertParticipant(ids++), socket: ws, nickname: name }; // This id needs to be 100% unique later.
    currentConcert.performers.push(performer);

    definePerformerClose(performer, currentConcert);
    definePerformerMessage(performer, currentConcert);

    console_log("New performer added to list: ");
    console_log(currentConcert.performers);
}

const definePerformerMessage = function (performer: Performer, currentConcert: Concert) {
    // Handle messages, including audio data.
    performer.socket.on('message', function message(data) {

        console_log("Received message data: ");
        console_log(data);
        console_log("\n");

        let message: Buffer = <Buffer>data;
        let headerData: CustomHeader = retrieveHeader(message);

        let headerEnd: number = headerData.headerEnd;
        let header: string = headerData.header;

        if (header == "") {
            if (headerEnd + 1 < message.byteLength && currentConcert.active == true) {
                receiveAudio(performer, retrieveMessageContents(message, headerEnd));
                concertTick(currentConcert);
                if (performer.data.bufferSize > maxAudioBufferSize) {
                    for (let i = 0; i < currentConcert.performers.length; ++i) {
                        if (currentConcert.performers.at(i) === performer) {
                            currentConcert.performers.splice(i, 1);
                            performer.socket.close();
                            console_log("Performer removed. Current performers: "); // CHECK IF DUPLICATE WITH SOCKET ONCLOSE CODE.
                            console_log(currentConcert.performers);
                            console_log("\n");
                        }
                    }
                }
            }
        }
        else {
            console_log("No event matches the given header: ");
            console_log(header);
            console_log("\n");
        }
    });
}

const definePerformerClose = function (performer: Performer, currentConcert: Concert) {
    // Identify performer socket and close connection.
    performer.socket.on('close', function message(data) {
        for (let i = 0; i < currentConcert.performers.length; ++i) {
            if (currentConcert.performers.at(i) === performer) {
                performer.socket.close();
                currentConcert.performers.splice(i, 1);

                const activePasscodeIndex = currentConcert.activePasscodes.indexOf(performer.passcode);
                if (activePasscodeIndex > -1) { currentConcert.activePasscodes.splice(activePasscodeIndex, 1); console_log(currentConcert.activePasscodes); }
                else { console_log("Passcoderemovalfailed"); }

                console_log("Performer removed. Current performers: "); // CHECK IF DUPLICATE WITH SOCKET ONCLOSE CODE.
                console_log(currentConcert.performers);
            }
        }
    });
}

export { addPerformer };