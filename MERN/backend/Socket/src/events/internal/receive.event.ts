import console_log from "../../../../functions/logging/console_log";
import { Performer } from "../../socket.types";

const receiveAudio = function (performer: Performer, rawAudio: ArrayBuffer) {
    // Write message contents into user's buffer.
    let thisView = new DataView(rawAudio);
    let performerData = performer.data;
    for (let i = 0; i < thisView.byteLength; ++i) {
        performerData.audioBuffer.writeUint8(thisView.getUint8(i), performerData.bufferSize);
        performerData.bytesLefttoProcess++;
        performerData.bufferSize++;
    }

    console_log("Total buffer bytes filled: ");
    console_log(performerData.bufferSize);
    console_log("\n");
}

export { receiveAudio };