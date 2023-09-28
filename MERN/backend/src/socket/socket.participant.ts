import WebSocket from "ws";
import { maxAudioBufferSize } from "./socket.config";

class ConcertParticipant {
    id: number = -1;
    socket: WebSocket;
    bytesProcessed: number = 0;
    bytesLefttoProcess: number = 0;
    bufferSize: number = 0;
    audioBuffer: Buffer;

    constructor(ws: WebSocket, id: number) {
        this.audioBuffer = Buffer.alloc(maxAudioBufferSize * 1.1);
        this.socket = ws;
        this.id = id;
    }
}

export default ConcertParticipant;

