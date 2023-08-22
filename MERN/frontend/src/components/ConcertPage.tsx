import "../style/App.css";
import ReactAudioPlayer from "react-audio-player";
import React, { useState } from "react";

import {MusicCard} from "./MusicCard";

type ButtonState = {
    name:string;
    index:number;
    isActive:boolean;
    onClick: Function;
}

function ConcertPage()
{
  const [songID, setSongID] = useState(0);
  var mainList:string[] = ["/alarm.wav", "/bark.wav", "/reverb.wav", "/trap.mp3"];
  function ChangeSongSource(i:number)
  {
      setSongID(i);
  }
  return (
    <div className="ConcertPage">
      <div className="Audio List btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div className ="btn-group-vertical" role="group">
        {mainList.map((key, index) => {
          return <button type="button" className="btn btn-primary" onClick ={() => ChangeSongSource(index)}>{key}</button>;;
        })}
        </div>
        <MusicCard songName = {mainList[songID]}/>
      </div>
      <br/>
      <ReactAudioPlayer src={mainList[songID]} controls />
    </div>
  );
}

export default ConcertPage;

