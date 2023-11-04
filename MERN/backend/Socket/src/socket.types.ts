import { WebSocket } from "ws";
import { maxAudioBufferSize } from "../config/socket.config";

type MixerInput = {
    buffers: Buffer[];
    state: any;
}

type MixerOutput = {
    mixedBuffer: Buffer;
    state: any;
}

type CustomHeader = {
    header: string;
    headerEnd: number;
}

type Concert = {
    performers: Performer[];
    maestro: Performer | undefined;
    waitingPerformers: waitingPerformer[];
    active: boolean;
    mixedAudio: Buffer;
    listener: Listener | undefined;
    attendance: { [passcode: string]: string; };
    activePasscodes: string[];
    mixerState: any;
    mixer: { mix: (i: MixerInput) => MixerOutput };
}

type Listener = {
    socket: WebSocket;
    passcode: string;
}

type waitingPerformer = {
    socket: WebSocket;
    nickname: string;
    passcode: string;
}

type Performer = {
    data: ConcertParticipant;
    socket: WebSocket;
    nickname: string;
    passcode: string;
}

class ConcertParticipant {
    //id: number = -1;
    bytesProcessed: number = 0;
    bytesLefttoProcess: number = 0;
    bufferSize: number = 0;
    audioBuffer: Buffer;

    constructor(id: number) {
        this.audioBuffer = Buffer.alloc(maxAudioBufferSize * 1.1);
        //this.id = id;
    }
}

export { Concert, ConcertParticipant, CustomHeader, waitingPerformer, Performer, Listener, MixerInput, MixerOutput };
