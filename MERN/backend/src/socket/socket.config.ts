// 32,000 bytes is about one second of 16kHz 16bit Mono PCM(raw) audio
const outgoingAudioChunkSize = 64000;

// 20,000,000 bytes is a little over 10 minutes of 16kHz 16bit Mono PCM(raw) audio
const maxAudioBufferSize = 40000000;

// const outgoingAudioChunkSize = 4;
// const maxAudioBufferSize = 50;

export { outgoingAudioChunkSize, maxAudioBufferSize };
