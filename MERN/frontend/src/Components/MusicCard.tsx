import React, { Component } from "react";
import "../Style/button.css"
import ReactAudioPlayer from "react-audio-player";
import { expressURL } from "../Variables/expressServer";

type SongName = {
  songName: string;
}

function MusicCard({ songName }: SongName) {
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
            <p className="text-muted">Tags: Fruit, Spring</p>
          </div>

          <div style={{ position: "absolute", bottom: "15px" }}>
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
            <ReactAudioPlayer src={expressURL + '/concerts/getSong?id=' + String(0)} controls />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MusicCard;
