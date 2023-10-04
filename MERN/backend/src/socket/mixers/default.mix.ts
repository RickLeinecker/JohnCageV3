import { outgoingAudioChunkSize } from "../socket.config";
import console_log from "../../logging/console_log";
import console_err from "../../logging/console_err";

const defaultMix = function (buffers: Buffer[]): Buffer {
    let mixedAudio: Buffer = Buffer.alloc(outgoingAudioChunkSize);

    // Error checking: all buffers should be same size.
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer == undefined || buffer.byteLength != outgoingAudioChunkSize) {
            console_log("Error: Buffer not correct size, or it doesn't exist: ");
            console_log(buffers.at(i));
            console_err("Error: Buffer not correct size, or it doesn't exist: ");
            console_err(buffers.at(i));
            return mixedAudio;
        }
    }

    // Create data views from buffers to do 16 bit calculations.
    let bufferViews: DataView[] = [];
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer != undefined) {
            let newView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
            bufferViews.push(newView);
        }
    }

    // Mix samples: Add all samples together and divide by the number of samples.
    let sampleCount = bufferViews.length;
    for (let i = 0; i < outgoingAudioChunkSize / 2; ++i) {
        var sampleSum: number = 0;
        for (let j = 0; j < sampleCount; ++j) {
            let view = bufferViews.at(j);
            if (view != undefined) {
                sampleSum += (32768 + view.getInt16(2 * i, true)) / sampleCount;
            }
        }

        mixedAudio.writeInt16LE((sampleSum - 32768), 2 * i);
        // Test if returns undefined with too big number.
        // Test if casting number works.
        // Test if the number can be calculated based on the size of the sample to avoid too big.
        // Print number to ensure it is correct.
        // Try printing typeof to confirm it is 16 bit as expected.
        // Save data to file to check in hex editor.
    }

    return mixedAudio;
}

export default defaultMix;