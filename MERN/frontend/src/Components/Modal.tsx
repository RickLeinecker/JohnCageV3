import React, { MouseEventHandler,useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import concertData from '../Types/concertData'
import MusicCard from './MusicCard'
import nextConcertData from '../Types/nextConcertData'
import LiveConcertCard from './LiveConcertCard'

type ModalData = {
    songData: concertData,
    isOpen: boolean,
    onClose: MouseEventHandler<HTMLElement>
}

type NextConcertModal = {
    concertData: nextConcertData,
    isOpen: boolean,
    onClose: MouseEventHandler<HTMLElement>
}

type ModalQuery = {
    concertData: nextConcertData | null,
    songData:concertData | null,
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
    backgroundColor:"white",
    padding: "50px",
    zIndex: 1000
}



function ModalNextConcert({isOpen,onClose,concertData}:NextConcertModal)
{

    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY} onClick={onClose} />
            <div style={MODAL}>

                <button className="btn btn-outline-danger" onClick={onClose} style ={{float:"right"}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
</svg></button>
                <br/>
                <div style ={{width:"50vw"}}>
                    <LiveConcertCard Maestro={concertData.GroupLeaderName} Title={concertData.Title} Tags = {concertData.Tags} Description= {concertData.Description} Date = {concertData.Date} Time = {concertData.Time}/>
                </div>
            </div>
        </>,
        document.getElementById("modal") as HTMLElement
    )
}

function SongModal({ isOpen, onClose, songData }: ModalData) {

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

function Modal({concertData,songData,isOpen,onClose}: ModalQuery)
{
    if (!isOpen || (!concertData && !songData)) return <></>;

    if (concertData)
    {
        return <ModalNextConcert isOpen = {isOpen} onClose={onClose} concertData={concertData}/>
    }
    else if (songData)
    {
        return <SongModal isOpen={isOpen} onClose={onClose} songData={songData}/>
    }
    else
        return <></>
    
}

export default Modal
