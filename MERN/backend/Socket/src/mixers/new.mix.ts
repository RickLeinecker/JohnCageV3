import { outgoingAudioChunkSize } from "../../config/socket.config";
import console_log from "../../../functions/logging/console_log";
import { MixerInput, MixerOutput } from "../socket.types";

type NewMixerState = {
    intervalsMixed: number;
}

function clamp(num: number, min: number, max: number) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}

const newMix = (mixerInput: MixerInput): MixerOutput => {
    console_log("ENTERTING NEW MIXER AAAAAAAA");

    // Unwrapping inputs and preparing new state.
    const buffers: Buffer[] = mixerInput.buffers;
    const oldState: any = mixerInput.state;
    let newState: NewMixerState = oldState;
    if (!newState || newState.intervalsMixed == undefined) { newState = { intervalsMixed: 0 } };

    // Goal audio buffer.
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

    let factor = 1;
    if (newState.intervalsMixed % 2 == 0) { console_log(newState.intervalsMixed + " intervals have been mixed.\n"); factor = 1.5 }

    // Mix samples: Add all samples together and divide by the number of samples.
    let sampleCount = bufferViews.length;
    // Divide by 2 since size is in bytes, audio is in 16 bit PCM.
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
        mixedAudio.writeInt16LE(clamp((sampleSum - 32768) * factor, -32760, 32760), 2 * i);
    }

    newState.intervalsMixed++;
    const result: MixerOutput = { mixedBuffer: mixedAudio, state: newState };
    return result;
}

exports.mix = newMix;