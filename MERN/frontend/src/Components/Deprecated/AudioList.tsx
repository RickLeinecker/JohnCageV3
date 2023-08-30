import "../style/App.css";
import ReactAudioPlayer from "react-audio-player";
import { useState } from "react";

type songList = {
  links: string[]
}

export const AudioList = (list: songList) => {
  
  const [songID, setSongID] = useState(0);

  function ChangeSongSource(i: number) {
    setSongID(i);
  }

  return (
    <div className="Audio List">
      <div className="Audio List btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div className="btn-group-vertical" role="group">
          {list.links.map((key, index) => {
            return <button type="button" className="btn btn-primary" onClick={() => ChangeSongSource(index)}>{key}</button>;;
          })}
        </div>
      </div>
      <br />
      <ReactAudioPlayer src={list.links[songID]} controls />
    </div>
  );
}

export default AudioList;
