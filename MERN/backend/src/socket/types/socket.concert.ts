import { WebSocket } from "ws";
import { ConcertParticipant, Performer } from "./socket.participant";

type Concert = {
    performers: Performer[];
    maestro: Performer | undefined;
    waitingPerformers: WebSocket[];
    active: boolean;
}

export { Concert };
