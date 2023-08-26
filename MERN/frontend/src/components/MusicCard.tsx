import React, { Component } from "react";
import "../style/button.css"
import ReactAudioPlayer from "react-audio-player";

type SongName = {
  songName : string;
}
export class MusicCard extends Component<SongName> {
  render() {
    return (
      <React.Fragment>
        <div
          className="card"
          style={{ width: "100%", height: "100%",backgroundColor: "#D9D9D9" }}
        >
          <div className="card-body">
            <h5 className="card-title song-name">{this.props.songName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">October 19th, 2022</h6>
            <p className="text-muted">Tags: Fruit, Spring</p>

            <div style = {{position: "absolute", bottom: "15px"}}>
            <button type="button" className="btn current">
              Edit
            </button>
            <button type="button" className="btn current">
              Download
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>
            <br/><br/>
            <ReactAudioPlayer src={this.props.songName} controls />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // setMetaData(name: string) {
  //   songName = name;
  // }
}

