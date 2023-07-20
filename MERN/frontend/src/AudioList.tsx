import "./App.css";
import ReactAudioPlayer from "react-audio-player";
import React, { useState } from "react";

export default function AudioList() {
  //filename.ext searches public, as you can see.
  var list = ["/alarm.wav", "/bark.wav", "/reverb.wav", "/trap.mp3"];
  const [songID, setSongID] = useState(0);
  function ChangeSongSource(i:number)
  {
      setSongID(i);
  }

  return (
    <div className="Audio List">
      {list.map((key, index) => {
        return <button onClick ={() => ChangeSongSource(index)}>{key}</button>;;
      })}
      <br/>
      <ReactAudioPlayer src={list[songID]} controls />
    </div>
  );
}
