import React, { useEffect, useState, useRef } from "react";
import "../Style/button.css"
import { websocketURL } from "../Variables/websocketServer";

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

function LiveConcertCard() {

  var ws: WebSocket | undefined = undefined;
  var audioCtx = new AudioContext();
  var nextStartTime = 0;

  const scheduleAudioChunk = (float32Samples: Float32Array) => {
    let audioBuffer = audioCtx.createBuffer(1, float32Samples.length, 16000);
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

  const connect = (passcode: string) => {
    try {
      let connectionURL = websocketURL + "/concert/listener?name=Listener=passcode=" + passcode;
      console.log(connectionURL);
      ws = new WebSocket(connectionURL);
      // ws.binaryType = "arraybuffer"; Probably not necessary.

      ws.onopen = () => {
        console.log("Socket connection opened.");
      }

      ws.onclose = (event: any) => {
        console.log("Socket connection closed.");
      }

      ws.onmessage = (event: any) => {
        console.log("WebSocket message: ", event);
        try {
          scheduleAudioChunk(PCM16ArrayBuffertoFloat32Samples(retrieveMessageContents(event, 0)));
        }
        catch (e) {
          console.log(e);
        }
      }
    }
    catch (e) {
      console.log(e);
      ws = undefined;
    }
  }

  return (
    <React.Fragment>
      <div
        className="card"
        style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
      >
        <div className="card-body" style={{ left: "25px", right: "25px" }}>
          <div>
            <h5 className="card-title song-name">
              <button onClick={() => connect}>Connect to listener socket.</button>
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">

            </h6>
            <p className="text-muted">
              {"Performers: "}
              {

              }
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
    </React.Fragment>
  );
}

export default LiveConcertCard;
