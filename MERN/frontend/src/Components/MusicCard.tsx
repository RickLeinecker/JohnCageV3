import React, { useEffect, useState, useRef } from "react";
import "../Style/button.css"
import MusicPlayer from "./MusicPlayer";
import concertData from "../Types/concertData";
import downloadConcert from "../API/downloadConcertAPI";

function MusicCard(thisConcert: concertData) {

  const [data, setData] = useState<concertData>({
    id: -1,
    title: "Click a Concert to Get Started.",
    date: "",
    description: "",
    tags: "Sample Tags",
    maestro: "",
    performers: [""]
  });

  // Get metadata useEffect hook
  useEffect(() => {
    if (thisConcert["id"] != -1) {
      setData(thisConcert);
    }
    else
      console.log("Concert is empteh");
  }, [thisConcert]);

  return (
    <React.Fragment>
      <div
        className="card"
        style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
      >
        <div className="card-body" style={{ left: "25px", right: "25px" }}>
          <div>
            <h5 className="card-title song-name">
              {data["title"]}
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {data["date"]}
            </h6>
            <p className="text-muted">
              {"Performers: "}
              {
                data["performers"].map((key, i) => {
                  return key + " ";
                })

              }
            </p>
            <p className="text-muted">
              {"\nTags: "}
              {
                data["tags"]
              }
            </p>
          </div>
          <div>
            <MusicPlayer id={data["id"]} />
            <p>
              {"Description: "}
              {data["description"]}
            </p>
            <button onClick={() => downloadConcert(data["id"], data["title"])}>
              Download
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MusicCard;


/*
   <button type="button" className="btn current">
              Edit
            </button>
            <button type="button" className="btn current">
              Download
            </button>
            <button type="button" className="btn btn-danger">
              Delete
            </button>

*/


