import { MutableRefObject,useEffect, useState } from "react"; 
import {
    IoPlayBackSharp,
    IoPlayForwardSharp,
    IoPlaySkipBackSharp,
    IoPlaySkipForwardSharp,
    IoPlaySharp,
    IoPauseSharp,
  } from 'react-icons/io5';
import "../Style/style.css"
import "../Style/App.css";

type AudioReference = {
    audioRef:HTMLAudioElement;
}

export default function Controls(audioRefPass:AudioReference)
{
    const[isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () =>{
        setIsPlaying((prev) => !prev);
    }
    
    useEffect(() =>{
        if (isPlaying)
        {
            audioRefPass.audioRef?.play();
        }
        else
        {
            audioRefPass.audioRef?.pause();
        }
        
    },[isPlaying,audioRefPass]

    );

    return(
        <div className ="container">
            <div className = "row">
                <div className="col">
                <button>
                    <IoPlaySkipBackSharp/>
                </button>
                </div>
                <div className="col">
                <button>
                    <IoPlayBackSharp/>
                </button>
                </div>
                <div className="col">
                <button onClick = {togglePlayPause}>
                    {isPlaying ? <IoPauseSharp/> : <IoPlaySharp/>}
                </button>
                </div>
                <div className="col">
                <button>
                    <IoPlayForwardSharp/>
                </button>
                </div>
                <div className="col">
                <button>
                    <IoPlaySkipForwardSharp/>
                </button>
                </div>
            </div>
        </div>
    )
}