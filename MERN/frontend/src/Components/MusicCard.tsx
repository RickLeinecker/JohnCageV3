import React, { Component } from "react";
import "../Style/button.css"
import ReactAudioPlayer from "react-audio-player";
import MusicPlayer from "./MusicPlayer";
import AudioPlayer from "./AudioPlayer";

type SongName = {
  songName: string;
  tagList: string[];
}

function TagString(tagList: string[]):string
{
  if (tagList.length == 0)
    return "";

  let tagString:string = tagList[0];
  for (let i = 1; i < tagList.length; i++)
  {
    tagString = tagString.concat(",",tagList[i]);
  }
  return tagString;
}

function MusicCard({ songName , tagList }: SongName) {
  return (
    <React.Fragment>
      <div
        className="card"
        style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
      >
        <div className="card-body" style={{ left: "25px", right: "25px" }}>
          <div>
            <h5 className="card-title song-name">{songName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">October 19th, 2022</h6>
            <p className="text-muted">Tags: {
              TagString(tagList)
              }
              </p>
          </div>

          <div>
            <button type="button" className="btn current">
              Edit
            </button>
            <button type="button" className="btn current">
              Download
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>
            <br /><br />
            {/* <ReactAudioPlayer src={'http://localhost:5000/api/getSong?id=' + String(0)} controls /> */}
            <MusicPlayer songsrc={songName}/>
            {/* <AudioPlayer/> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MusicCard;
