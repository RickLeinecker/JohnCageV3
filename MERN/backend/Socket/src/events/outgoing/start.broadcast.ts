import { Concert } from "../../socket.types"
import { broadcastMessage } from "../../utilities/socket.binary"

const broadcastStart = function (currentConcert: Concert) {
    let utf8Encode = new TextEncoder();
    broadcastMessage(currentConcert, utf8Encode.encode("start"), true, false, true, true);
}

export { broadcastStart };