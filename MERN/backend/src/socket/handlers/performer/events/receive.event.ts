import ConcertParticipant from "../../../types/socket.participant";
import console_log from "../../../../logging/console_log";

const receiveAudio = function (performer: ConcertParticipant, rawAudio: ArrayBuffer) {
    // Write message contents into user's buffer.
    let thisView = new DataView(rawAudio);
    for (let i = 0; i < thisView.byteLength; ++i) {
        performer.audioBuffer.writeUint8(thisView.getUint8(i), performer.bufferSize);
        performer.bytesLefttoProcess++;
        performer.bufferSize++;
    }

    console_log("Total buffer bytes filled: ");
    console_log(performer.bufferSize);
    console_log("\n");
}

export { receiveAudio };