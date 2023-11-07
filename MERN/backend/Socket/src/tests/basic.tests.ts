import { ConcertParticipant } from "../socket.types";
// import defaultMix from "../mixers/default.mix";

const test_printAllBuffers = function (performers: ConcertParticipant[]): void {
    for (let i = 0; i < performers.length; ++i) {
        let performer = performers.at(i);
        if (performer != undefined) {
            console.log("Performer " + i + ":", performer.audioBuffer);
        }
    }
}

const test_testMixer = function (): void {
    // Test data
    let myarraybuffer: Int8Array = new Int8Array([-128, 0, 5, 40]);
    let mynicebuff: Buffer = Buffer.from(myarraybuffer);
    let myarraybuffer2: Int8Array = new Int8Array([127, 255, 5, 40]);
    let mynicebuff2: Buffer = Buffer.from(myarraybuffer2);
    // console.log(mynicebuff);
    // console.log(mynicebuff2);
    // console.log(mynicebuff.byteLength);
    let mynicearray: Buffer[] = [mynicebuff, mynicebuff2];

    // Mixer
    // console.log(defaultMix(mynicearray));
}

export { test_printAllBuffers, test_testMixer };