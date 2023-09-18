import React from "react";
import "../Style/button.css"
import MusicPlayer from "./MusicPlayer";
import concertData from "../Types/concert";

// Backup { title, date, description, tags, maestro, performers }: concertData
function MusicCard(thisConcert: concertData) {
  return (
    <React.Fragment>
      <div
        className="card"
        style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
      >
        <div className="card-body" style={{ left: "25px", right: "25px" }}>
          <div>
            <h5 className="card-title song-name">
              {thisConcert["title"]}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {thisConcert["date"]}
            </h6>
            <p className="text-muted">
              {"Tags: "}
              {
                thisConcert["tags"].map((key, i) => {
                  return <span key={i}>{key + " "}</span>
                })
              }
            </p>
          </div>
          <div>
            <MusicPlayer id={thisConcert["id"]} />
            <p>
              {"Description: "}
              {thisConcert["description"]}
            </p>
            <button type="button" className="btn current">
              Edit
            </button>
            <button type="button" className="btn current">
              Download
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MusicCard;
