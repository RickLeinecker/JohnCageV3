import { useEffect, useState } from 'react';
import { Button, Card } from "react-bootstrap";
import NavigationBar from "../../Components/Deprecated/K_NavigationBar"

function buildPath(route: String) {
  return 'http://localhost:5000/' + route;
}

function Home() {

  const [resText, setResText] = useState<string>('');

  // Basic API test: If the page does not display hellow world as response text, API prob unconnected.
  useEffect(() => {
    const helloWorld = async function () {
      try {
        const response = await fetch(buildPath(""), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        setResText("Response Text: " + await response.text());
      }
      catch (e) {
        if (e instanceof Error) {
          alert(e.toString());
        }
        return;
      }
    };

    helloWorld();
  }, []);

  // This function is a working example of an AudioContext playing audio.
  // The white noise audio is created using random floats between -1 and 1.
  // If we can find out how to convert the webm or other format, into this float format, 
  // we might be able to use AudioContexts for playback on the client's device.
  const whiteNoise = async function () {
    const audioCtx = new window.AudioContext();
    const frameCount = audioCtx.sampleRate * 2.0;
    const myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const nowBuffering = myArrayBuffer.getChannelData(channel);

      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = Math.random() * 2 - 1;
      }
    }

    const source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
  }

  return (
    <div className="Home Page"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <NavigationBar />
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Card.Title>Home Page</Card.Title>
        {resText}
        <Button style={{ alignItems: 'center' }} onClick={() => whiteNoise()}>Listen to white noise</Button>
      </Card>
    </div >
  );
}

export default Home;