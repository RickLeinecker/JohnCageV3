import { Concert } from "../../socket.types"
import { broadcastMessage } from "../../utilities/socket.binary"

const broadcastStop = function (currentConcert: Concert) {
    let utf8Encode = new TextEncoder();
    broadcastMessage(currentConcert, utf8Encode.encode("stop"), true, true, true);
}

export { broadcastStop };