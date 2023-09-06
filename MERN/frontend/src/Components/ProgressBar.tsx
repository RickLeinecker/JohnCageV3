import { LegacyRef, useEffect, useState } from "react"; 
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons";
import "../Style/style.css"
import "../Style/App.css";
import "../Style/customprogressbar.css"

type ProgressRef = {
    progressRef:LegacyRef<HTMLInputElement>;
}

export default function ProgressBar(progressRefPass:ProgressRef)
{

    const handleProgressChange = () => {
        if (progressRefPass.progressRef)
        console.log("Current value of progress ref is "+progressRefPass.progressRef.valueOf);
      };

    return(
        <div className = "progress">
            <span className ="progress">00:00</span>
            <input type ="range" ref = {progressRefPass.progressRef} defaultValue={0} onChange={handleProgressChange}/>
            <span className="time">03:34</span>
        </div>
    )
}