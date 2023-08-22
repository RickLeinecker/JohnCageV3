import React, { Component } from "react";

type SongName = {
  songName : string;
}
export class MusicCard extends Component<SongName> {
  render() {
    return (
      <React.Fragment>
        <div
          className="card"
          style={{ width: "18rem", backgroundColor: "#dde4f0" }}
        >
          <div className="card-body">
            <h5 className="card-title song-name">{this.props.songName}</h5>
            <h6 className="card-subtitle mb-2 text-muted">October 19th, 2022</h6>
            <p className="text-muted">Tags: Fruit, Spring</p>

            <button type="button" className="btn btn-primary">
              Edit
            </button>
            <button type="button" className="btn btn-primary">
              Download
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // setMetaData(name: string) {
  //   songName = name;
  // }
}

