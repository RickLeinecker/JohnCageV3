import '../CSS/App.css';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  // This function is a working example of an AudioContext playing audio.
  // The white noise audio is created using random floats between -1 and 1.
  // It is commented out because it can be loud if you aren't expecting it.
  // If we can find out how to convert the webm or other format, into this float format, 
  // we might be able to use AudioContexts for playback on the client's device,
  // at least on the web.
  const whiteNoise = async function () {
    /*
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
    */
  }

  return (
    <div className="Search Page">
      <Button onClick={() => navigate("/listen")}>Listen Page</Button>
      <Button onClick={() => navigate("/record")}>Record Page</Button>
      <Button onClick={() => whiteNoise()}>White Noise</Button>
    </div>
  );
}

export default Home;