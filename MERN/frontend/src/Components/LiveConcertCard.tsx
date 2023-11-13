import React, { useEffect, useState, useRef } from "react";
import "../Style/button.css"
import { websocketURL } from "../Variables/websocketServer";
import { Buffer } from "buffer";
import { Row } from "react-bootstrap";
import validateListener from "../API/validateListenerAPI";

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

function LiveConcertCard(nextConcert: { Maestro: string, Title: string, Tags: string[], Description: string, Date: string, Time: string }) {

  const [passcode, setPasscode] = useState<string>("");
  const [status, setStatus] = useState<string>("Not connected.");

  var audioCtx: AudioContext;
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

  const connect = async function () {
    if (!(await validateListener(passcode))) { return; }
    else {
      audioCtx = new AudioContext();

      let connectionURL = websocketURL + "/concert/listener?name=Listener=passcode=" + passcode;
      console.log(connectionURL);
      ws = new WebSocket(connectionURL);
      ws.binaryType = "arraybuffer"; // VERY IMPORTANT

      ws.onopen = () => {
        console.log("Socket connection opened.");
        setStatus("Listening.");

      }

      ws.onclose = () => {
        console.log("Socket connection closed.");
        setStatus("Not connected.");
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

  }

  const close = function () { ws?.close(); }

  return (
    <div
      className="card"
      style={{ width: "50%", height: "100%", backgroundColor: "#D9D9D9", transform: "translateX(50%)" }}
    >
      <div className="card-body" style={{ left: "25px", right: "25px" }}>
        <div>
          <h1 className="card-title song-name">
            <p>
              {"Title: "}
              {nextConcert.Title}
            </p>
          </h1>
          <p>
            {"Maestro: "}
            {nextConcert.Title}
          </p>
          <p>
            {"Tags: "}
            {nextConcert.Tags}
          </p>
          <p>
            {"Description: "}
            {nextConcert.Description}
          </p>
          <p>
            {"Date and Time: "}
            {nextConcert.Date + " " + nextConcert.Time + " UTC"}
          </p>

          <input
            type='text'
            name='passcode'
            placeholder="Listener Passcode"
            value={passcode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPasscode(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: '1em' }}
          ></input>
          <text style={{ color: "red" }}>{status}</text>
          <br></br>
          <br></br>
          <Row>
            <button style={{
              display: "block",
              padding: '10px', width: '50%', borderRadius: '1em'
            }} onClick={connect}>Connect to Listen Live</button>
            <button style={{
              display: "block",
              padding: '10px', width: '50%', borderRadius: '1em'
            }} onClick={close}>Stop</button>
          </Row>

        </div>
      </div>
    </div>
  );
}

export default LiveConcertCard;
