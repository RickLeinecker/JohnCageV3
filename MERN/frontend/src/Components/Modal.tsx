import React, { MouseEventHandler,useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import concertData from '../Types/concertData'
import MusicPlayer from "./MusicPlayer";
import downloadConcert from "../API/downloadConcertAPI";

type ModalData = {
    songData: concertData,
    isOpen: boolean,
    onClose: MouseEventHandler<HTMLElement>
}

const OVERLAY: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000
}

const MODAL: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    
    padding: "50px",
    zIndex: 1000
}

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


export default function Modal({ isOpen, onClose, songData }: ModalData) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY} onClick={onClose} />
            <div style={MODAL}>

                <button className="btn btn-outline-danger" onClick={onClose} style ={{float:"right"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
</svg></button>
                <br/>
                <MusicCard id={songData["id"]} title={songData["title"]} date={songData["date"]} description={songData["description"]} tags={songData["tags"]} maestro={songData["maestro"]} performers={songData["performers"]} />
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    )
}
