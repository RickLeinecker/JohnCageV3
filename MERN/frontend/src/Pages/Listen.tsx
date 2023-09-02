import { useEffect, useRef } from 'react';
import { Card } from "react-bootstrap";
import io from 'socket.io-client';
const ServerURL = "http://localhost";

//Functions
function Listen() {

  var socket: any;
  var sourceBuffer: SourceBuffer;
  const audioElement = useRef<HTMLAudioElement>(null);


  //useEffect hook "runs" the inside every time a variable in the square brackets at the bottom
  //changes. Since that array of variables is empty, it will run only once, when the page loads.
  //This is the desired behavior to set up the listening socket connection.
  //It actually triggers twice on page load but that can be fixed and it works anyway.
  useEffect(() => {
    var mediaSource = new MediaSource();
    mediaSource.addEventListener("sourceopen", sourceOpen);

    function sourceOpen() {
      sourceBuffer = mediaSource.addSourceBuffer("audio/webm; codec=opus");// webm required for MediaSource compatibility.
      console.log("sourceOpen: ", mediaSource);
    };

    if (audioElement.current) {
      audioElement.current.src = URL.createObjectURL(mediaSource);
    }

    //buffer.addEventListener('error', console.log);

    socket = io(ServerURL + ":5001");

    socket.on('greet', (data: String) => {
      console.log('Listen Page "receiveGreet" socket event:', data);
    });

    socket.on('listening', function (data: any) {
      console.log(data);
      if (audioElement.current) {
        sourceBuffer.appendBuffer(data);
      }
    });
  }, []);

  return (
    <div className="Listen Page">
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Card.Title>Listen Page</Card.Title>
        <Card.Body>
          <Card.Title>Listen to Stream</Card.Title>
          <audio preload='auto' ref={audioElement} controls={true} autoPlay={true}></audio>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Listen;

//Failed attempts:

//------------------------------------------------------------------
/*
// Attempting to play back stream by making a new blob and URL once a chunk is recieved.
// FAILURE mostly, since there is a brief pause every time the url of the audio element "src" attribute is changed.
// Otherwise, it works.
  // See:
  //   Problem: playback restarts every time this function is called.
  //   This should play back the audio stream as it is recieved, but keeps restarting.
  //   Is it because I create a new blob every time?
  //   How do I add to the data while also keeping playback and updating the blob metadata?
  //     Answer: swap the audio play times when swapping blob URLs for src.
  //   Problem: Playback stutters every time I change the "src" attribute to the new URL.
  //     Answer: Don't create a new URL every time. Use another object or library, like MediaSource.

var audioChunks = [];

audioChunks.push(data);
const blob = new Blob(audioChunks, { type: 'audio/webm; codecs=opus' });
const audioUrl = URL.createObjectURL(blob);

// Saving and replacing the current time, like so, keeps playback going
// But there is a tiny pause each time this happens, maybe transitioning from paused to play again.
let currentTime = audioElement.current.currentTime;
console.log("AudioElement current time: ", currentTime)
audioElement.current.src = audioUrl;
// console.log("AudioElement time after new url: ", audioElement.current.currentTime) // Always 0
audioElement.current.currentTime = currentTime;
console.log("AudioElement time after resuming at original time:", audioElement.current.currentTime)
*/
//------------------------------------------------------------------
/*
// Attempting to play back streamed audio using an AudioContext
// FAILURE, but probably possible.

var audioCtx;

const initial = async function () {
  audioCtx = new window.AudioContext();
  //console.log(MediaSource.isTypeSupported("audio/webm; codecs=opus"))
}

const start = async function (data) {
  const frameCount = audioCtx.sampleRate * 2.0;
  const myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

  for (let channel = 0; channel < 2; channel++) {

    const nowBuffering = myArrayBuffer.getChannelData(channel);

    for (let i = 0; i < data.byteLength / 4; i++) {
      nowBuffering[i] = data.getFloat32(i);
      console.log(data.getFloat32(i))
    }
  }

  const source = audioCtx.createBufferSource();

  source.buffer = myArrayBuffer;

  source.connect(audioCtx.destination);

  source.start();
}
*/
//------------------------------------------------------------------