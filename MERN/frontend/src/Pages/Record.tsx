import { useEffect, useRef } from 'react';
import { Card, Button } from "react-bootstrap";
import io from 'socket.io-client';
import { socketURL } from "../Variables/socketServer";

//Functions
function Record() {

  var socket: any;
  var inputStream: MediaStream;
  const mediaRecorder = useRef<MediaRecorder>();

  //useEffect hook "runs" the inside every time a variable in the square brackets at the bottom
  //changes. Since that array of variables is empty, it will run once when the page loads.
  //This is the desired behavior to set up the recording socket connection.
  //It actually triggers twice on page load but that can be fixed and it works anyway.
  useEffect(() => {
    socket = io(socketURL);

    socket.on('greet', (data: String) => {
      console.log('Record Page "receiveGreet" socket event:', data);
    });
  }, []);

  const startRecording = async function () {
    // Get user microphone stream (also asks permission if it isn't already given).
    inputStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // This object appears to take the data stream from the micrphone, presumably raw audio,
    // then encodes it using the specified mime type,
    // and makes it available in the ondataavailable event.
    mediaRecorder.current = new MediaRecorder(inputStream, { mimeType: "audio/webm; codecs=opus" });// webm required for MediaSource compatibility.

    mediaRecorder.current.ondataavailable = e => {
      console.log(e.data)
      if (e.data.size > 0) {
        socket.emit("recording", e.data);
        console.log("Audio data recorded. Transmitting to server via socketio...");
      }
    };

    //This integer argument is the milliseconds between each "ondataavailable" call.
    mediaRecorder.current.start(1000);
  };

  const stopRecording = async function () {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      inputStream.getTracks().forEach((track) => track.stop());
      console.log("Recording stopped.");
    };
  }

  return (
    <div className="Audio Recording">
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Card.Title>Record Page</Card.Title>
        <Card.Body>
          <Card.Title>Record Audio</Card.Title>
          <Button onClick={() => startRecording()}>Start</Button>
          <Button onClick={() => stopRecording()}>Stop</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Record;