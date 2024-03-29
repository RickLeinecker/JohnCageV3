import { outgoingAudioChunkSize } from "../../config/socket.config";
import console_log from "../../../functions/logging/console_log";
import { MixerInput, MixerOutput } from "../socket.types";

type DefaultMixerState = {
    intervalsMixed: number;
}

const defaultMix = (mixerInput: MixerInput): MixerOutput => {
    const buffers: Buffer[] = mixerInput.buffers;
    const oldState: any = mixerInput.state;
    let newState: DefaultMixerState = oldState;
    if (!newState || newState.intervalsMixed == undefined) { newState = { intervalsMixed: 0 } };

    let mixedAudio: Buffer = Buffer.alloc(outgoingAudioChunkSize);

    // Error checking: all buffers should be same size when they are passed.
    for (let i = 0; i < buffers.length; ++i) {
        let buffer = buffers.at(i);
        if (buffer == undefined || buffer.byteLength != outgoingAudioChunkSize) {
            console_log("Error: Buffer not correct size, or it doesn't exist: ");
            console_log(buffers.at(i));
            const result: MixerOutput = { mixedBuffer: mixedAudio, state: null };
            return result;
        }
    }

    // Create data views on top of buffers to do 16 bit calculations.
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
        let sampleSum: number = 0;
        for (let j = 0; j < sampleCount; ++j) {
            let view = bufferViews.at(j);
            if (view != undefined) {
                // MUST BE LITTLE ENDIAN (true)
                sampleSum += (32768 + view.getInt16(2 * i, true)) / sampleCount;
            }
        }

        // MUST BE LITTLE ENDIAN
        mixedAudio.writeInt16LE((sampleSum - 32768), 2 * i);
    }

    newState.intervalsMixed++;
    if (newState.intervalsMixed % 2 == 0) { console_log(newState.intervalsMixed + " intervals have been mixed.\n"); }
    const result: MixerOutput = { mixedBuffer: mixedAudio, state: newState };
    return result;
}

exports.mix = defaultMix;