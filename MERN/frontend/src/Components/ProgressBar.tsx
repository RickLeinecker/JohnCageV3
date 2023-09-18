import { LegacyRef } from "react";
import "../Style/style.css"
import "../Style/App.css";
import "../Style/customprogressbar.css"

type ProgressRef = {
    progressRef: LegacyRef<HTMLInputElement>;
}

function ProgressBar(progressRefPass: ProgressRef) {

    const handleProgressChange = () => {
        if (progressRefPass.progressRef)
            console.log("Current value of progress ref is " + progressRefPass.progressRef.valueOf);
    };

    return (
        <div className="progress">
            <span className="progress">00:00</span>
            <input type="range" ref={progressRefPass.progressRef} defaultValue={0} onChange={handleProgressChange} />
            <span className="time">03:34</span>
        </div>
    )
}

export default ProgressBar;