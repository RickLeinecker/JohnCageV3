import "./App.css";
import ReactAudioPlayer from "react-audio-player";

export default function AudioList() {
  //filename.ext searches public, as you can see.
  var list = ["/alarm.wav", "/bark.wav", "/reverb.wav", "/trap.mp3"];

  return (
    <div className="Audio List">
      {list.map((key, index) => {
        return <ReactAudioPlayer src={list[index]} controls />;
      })}
    </div>
  );
}
