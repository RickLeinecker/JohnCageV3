import WebSocket, { WebSocketServer } from "ws";
import console_log from "../../logging/console_log";
import defaultMix from "../mixers/default.mix";
import { Concert } from "../types/socket.concert";
import { ConcertParticipant } from "../types/socket.participant";
import { outgoingAudioChunkSize } from "../socket.config";
import { Performer } from "../types/socket.participant";
import { addPerformer } from "../handlers/performer.handler";

const updatePerformers = function (currentConcert: Concert): void {
    let performers: Performer[] = currentConcert.performers;
    let maestro: Performer | undefined = currentConcert.maestro;

    // Update performers.
    for (let i = 0; i < performers.length; ++i) {
        let performer: ConcertParticipant | undefined = performers.at(i)?.data;
        if (performer != undefined) {
            performer.bytesProcessed += outgoingAudioChunkSize; // THIS IS NOT GOOD ENOUGH
            performer.bytesLefttoProcess -= outgoingAudioChunkSize;
        }
    }

    // Update Maestro.
    if (maestro != undefined) {
        maestro.data.bytesProcessed += outgoingAudioChunkSize; // THIS IS NOT GOOD ENOUGH
        maestro.data.bytesLefttoProcess -= outgoingAudioChunkSize;
    }
}

const gatherAudioBuffers = function (currentConcert: Concert): Buffer[] {
    let performers: Performer[] = currentConcert.performers;
    let maestro: Performer | undefined = currentConcert.maestro;

    // Collect participant buffers to pass them to the mixer if they are of the required size.
    let rawBuffers: Buffer[] = [];
    for (let i = 0; i < performers.length; ++i) {
        let performer: ConcertParticipant | undefined = performers.at(i)?.data;
        if (performer != undefined) {
            let chunkStart = performer.audioBuffer.byteOffset + performer.bytesProcessed;
            let chunk = performer.audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingAudioChunkSize);
            rawBuffers.push(Buffer.from(chunk));
        }
    }

    // Also collet Maestro's.
    if (maestro) {
        let chunkStart = maestro.data.audioBuffer.byteOffset + maestro.data.bytesProcessed;
        let chunk = maestro.data.audioBuffer.buffer.slice(chunkStart, chunkStart + outgoingAudioChunkSize);
        console.log(maestro.data.audioBuffer.buffer);
        console.log(chunk);
        rawBuffers.push(Buffer.from(chunk));
    }

    return rawBuffers;
}

const validatePerformerBuffers = function (currentConcert: Concert): boolean {
    let performers: Performer[] = currentConcert.performers;
    let maestro: Performer | undefined = currentConcert.maestro;

    // Make sure there is enough audio data from each participant.
    for (let i = 0; i < performers.length; ++i) {
        let performer: ConcertParticipant | undefined = performers.at(i)?.data;
        if (performer != undefined) {
            if (performer.bytesLefttoProcess < outgoingAudioChunkSize) {
                return false;
            }
        }
    }

    // Also check Maestro.
    if (maestro) {
        if (maestro.data.bytesLefttoProcess < outgoingAudioChunkSize) {
            return false;
        }
    }

    return true;
}

const concertTick = function (currentConcert: Concert) {
    // If there is enough data in each participant's buffer, mix and send.
    if (validatePerformerBuffers(currentConcert) === true) {
        console_log("Performer buffers validated.");

        // Gather equally sized audio chunks.
        let chunkBuffers: Buffer[] = gatherAudioBuffers(currentConcert);
        console_log("Audio buffers gathered.");
        console_log(chunkBuffers);

        // Mix audio chunks.
        let mixedBuffer: Buffer = defaultMix(chunkBuffers);
        console_log("Audio mixed.");
        console_log(mixedBuffer);

        // Broadcast mixed chunk.
        currentConcert.performers.forEach(function each(performer) {
            let socket: WebSocket = performer.socket;
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(mixedBuffer, { binary: true });
                console_log("Mixed chunk sent:");
                console_log(mixedBuffer);
            }
        });
        currentConcert.maestro?.socket.send(mixedBuffer, { binary: true });

        // Update performers' internal data.
        updatePerformers(currentConcert);
        console_log("\n");

        // Add any waiting participants to the concert.
        // Doing this in tick is supposed to guaruntee a small amout of synchronization.
        if (currentConcert.waitingPerformers.length > 0) {
            let waitingPerformers: WebSocket[] = currentConcert.waitingPerformers;
            for (let i = 0; i < waitingPerformers.length; ++i) {
                let socket: WebSocket | undefined = waitingPerformers.pop();
                if (socket) {
                    addPerformer(socket, currentConcert);
                }
            }
        }
    }
}

export default concertTick;
