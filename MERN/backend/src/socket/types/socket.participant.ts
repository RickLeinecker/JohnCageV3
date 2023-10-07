import WebSocket from "ws";
import { maxAudioBufferSize } from "../socket.config";

type Performer = {
    data: ConcertParticipant;
    socket: WebSocket;
}

class ConcertParticipant {
    id: number = -1;
    bytesProcessed: number = 0;
    bytesLefttoProcess: number = 0;
    bufferSize: number = 0;
    audioBuffer: Buffer;

    constructor(id: number) {
        this.audioBuffer = Buffer.alloc(maxAudioBufferSize * 1.1);
        this.id = id;
    }
}

export { Performer, ConcertParticipant };

