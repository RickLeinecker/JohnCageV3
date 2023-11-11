import React, { useEffect, useState, useRef } from "react";
import "../Style/button.css"
import { websocketURL } from "../Variables/websocketServer";
import { Buffer } from "buffer";

const retrieveMessageContents = function (message: Buffer, headerEnd: number): ArrayBuffer {
  return message.buffer.slice(message.byteOffset + headerEnd + 1, message.byteOffset + message.byteLength);
}

const PCM16ArrayBuffertoFloat32Samples = (buffer: ArrayBuffer) => {
  const numSamples = buffer.byteLength / 2;
  var bufferView = new DataView(buffer);
  var floatSamples = new Float32Array(numSamples);
  for (var i = 0; i < numSamples; i++) {
    floatSamples[i] = bufferView.getInt16(2 * i, true) / 32768;
  }

  return floatSamples;
};

type CustomHeader = {
  header: string;
  headerEnd: number;
}

const retrieveHeader = function (data: Buffer): CustomHeader {
  // // Store message in Buffer and view through a DataView.
  let buffer: Buffer = Buffer.from(data as Buffer);
  if (buffer.byteLength == 0) { return { header: "", headerEnd: 0 }; }
  let thisView = new DataView(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

  // Get the event header in the form of 1 byte characters until the NULL character (0).
  let eventHeader: string = "";
  let isTerminated: boolean = false;
  let nextCharacter: string = String.fromCharCode(thisView.getUint8(0));
  let headerEnd: number = 0;
  for (let i = 0; i < 64 && i < thisView.byteLength; ++i) {
    nextCharacter = String.fromCharCode(thisView.getUint8(i));
    if (nextCharacter == String.fromCharCode(0)) {
      headerEnd = i;
      isTerminated = true;
      break;
    }
    eventHeader = eventHeader.concat(nextCharacter);
  }

  console.log("Detected header: ");
  console.log(eventHeader);
  console.log("\n");

  let headerInfo: CustomHeader = { header: eventHeader, headerEnd: headerEnd };
  return headerInfo;
}

var ws: WebSocket | undefined = undefined;

function LiveConcertCard() {

  const [passcode, setPasscode] = useState<string>("");

  var audioCtx = new AudioContext();
  var nextStartTime = 0;

  const scheduleAudioChunk = (float32Samples: Float32Array) => {
    let audioBuffer = audioCtx.createBuffer(1, float32Samples.length, 32000);
    audioBuffer.getChannelData(0).set(float32Samples);
    let source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    console.log(nextStartTime);
    console.log("AUDIOTIME: ", audioCtx.currentTime);

    if (nextStartTime <= audioCtx.currentTime) {
      nextStartTime = audioCtx.currentTime;
      source.start(nextStartTime);
      nextStartTime += audioBuffer.length / audioBuffer.sampleRate;
    } else {
      source.start(nextStartTime);
      nextStartTime += audioBuffer.length / audioBuffer.sampleRate;
    }
  };

  const connect = function () {
    let connectionURL = websocketURL + "/concert/listener?name=Listener=passcode=" + passcode;
    console.log(connectionURL);
    ws = new WebSocket(connectionURL);
    ws.binaryType = "arraybuffer"; // VERY IMPORTANT

    ws.onopen = () => {
      console.log("Socket connection opened.");
    }

    ws.onclose = (event: any) => {
      console.log("Socket connection closed.");
    }

    ws.onmessage = (event: any) => {
      let message: Buffer = Buffer.from(event.data as Buffer);
      let headerData: CustomHeader = retrieveHeader(message);

      let headerEnd: number = headerData.headerEnd;
      let header: string = headerData.header;

      if (header == "") {
        scheduleAudioChunk(PCM16ArrayBuffertoFloat32Samples(retrieveMessageContents(message, headerEnd)));
      }
    }
  }

  return (
    <div
      className="card"
      style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
    >
      <div className="card-body" style={{ left: "25px", right: "25px" }}>
        <div>
          <h5 className="card-title song-name">
            <button onClick={connect}>Connect to listener socket.</button>
            <input
              type='text'
              name='passcode'
              value={passcode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPasscode(e.target.value)}
              style={{ padding: '10px', width: '100%', borderRadius: '1em' }}
            ></input>
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">

          </h6>
          <p className="text-muted">
          </p>
          <p className="text-muted">
            {"\nTags: "}
            {

            }
          </p>
        </div>
        <div>
          <p>
            {"Description: "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LiveConcertCard;
