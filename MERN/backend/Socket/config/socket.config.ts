// // 64,000 bytes is about one second of 32kHz 16bit Mono PCM(raw) audio
 const outgoingAudioChunkSize = 64000;

// // 40,000,000 bytes is a little over 10 minutes of 32kHz 16bit Mono PCM(raw) audio
 const maxAudioBufferSize = 40000000;

// Currently unused, but reflects what mobile app does.
const sampleRate = 32000;
const bitDepth = 16;
const channels = 1;

//const outgoingAudioChunkSize = 6;
//const maxAudioBufferSize = 50;

// Maximum size to check for custom headers in binary "message" socket events.
const maxCustomHeaderSize = 64;

export { outgoingAudioChunkSize, maxAudioBufferSize, maxCustomHeaderSize };
