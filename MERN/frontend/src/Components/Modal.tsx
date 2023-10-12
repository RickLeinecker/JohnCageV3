import React, { MouseEventHandler } from 'react'
import ReactDOM from 'react-dom'
import concertData from '../Types/concertData'
import MusicCard from './MusicCard'

type ModalData = {
    songData:concertData,
    isOpen:boolean,
    onClose:MouseEventHandler<HTMLElement>
}

const OVERLAY:React.CSSProperties  = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 1000
}

const MODAL:React.CSSProperties  = {
    position: "fixed",
    top: "50%",
    left:"50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding :"50px",
    zIndex: 1000
}

export default function Modal({isOpen, onClose, songData}:ModalData) {
    if (!isOpen) return null

  return ReactDOM.createPortal(
    <>
    <div style={OVERLAY} onClick = {onClose}/>
    <div style = {MODAL}>
        
        <button onClick = {onClose}>Close Modal</button>
        <MusicCard id={songData["id"]} title={songData["title"]} date={songData["date"]} description={songData["description"]} tags={songData["tags"]} maestro={songData["maestro"]} performers={songData["performers"]} />
    </div>
    </>,
    document.getElementById("modal") as HTMLElement
  )
}
