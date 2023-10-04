import { WebSocket } from "ws";
import ConcertParticipant from "./socket.participant"

type Concert = {
    performers: ConcertParticipant[];
    sockets: WebSocket[];
}

export default Concert;
