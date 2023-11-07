import { Concert, waitingPerformer, Performer, CustomHeader } from "../../socket.types";
import { broadcastMessage } from "../../utilities/socket.binary";

const broadcastNames = function (currentConcert: Concert): void {
    let names: string = "";

    for (let passcode in currentConcert.attendance) {
        names += '`' + currentConcert.attendance[passcode];
    }

    let utf8Encode = new TextEncoder();
    broadcastMessage(currentConcert, utf8Encode.encode("participants:" + names), true, true, true, true);
}

export { broadcastNames };