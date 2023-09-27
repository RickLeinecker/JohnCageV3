import WebSocket from "ws";

class ConcertParticipant {
    id: number = -1;
    socket: WebSocket;
    bytesProcessed: number = 0;
    bytesLefttoProcess: number = 0;
    audioBuffer: Buffer = Buffer.from("");

    constructor(ws: WebSocket, id: number) {
        this.socket = ws;
        this.id = id;
    }
}

export default ConcertParticipant;

