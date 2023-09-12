import { LegacyRef, useRef, useState } from "react"; 
import DisplayTrack from "./DisplayTrack";
import "../Style/style.css"
import "../Style/App.css";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import alarm from "../assets/trap.mp3";

export default function AudioPlayer()
{
    const[currentTrack, setCurrentTrack] = useState(alarm);

    const audioRef = useRef<HTMLAudioElement>();
    const progressBarRef = useRef<HTMLInputElement>();
    console.log("audio ref is "+alarm);

    return(
        <div className = "audioPlayer">
            <div className="inner">
                <DisplayTrack activeTrack= {currentTrack as string} audioRef={audioRef as LegacyRef<HTMLAudioElement>}/>
                
                <Controls audioRef={audioRef.current as HTMLAudioElement}/>
                </div>
        </div>
    )
}