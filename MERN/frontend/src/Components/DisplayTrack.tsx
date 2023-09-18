import { LegacyRef, MutableRefObject, RefObject, useEffect, useState } from "react"; 
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons";
import "../Style/style.css"
import "../Style/App.css";

type trackData = {
    activeTrack:string;
    audioRef:LegacyRef<HTMLAudioElement>;
}

export default function DisplayTrack({activeTrack,audioRef}:trackData)
{
    return(
        <div className = "audioPlayer">
            <audio src ={activeTrack} ref ={audioRef}/>
        </div>
    )
}