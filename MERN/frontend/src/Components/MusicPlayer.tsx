import { useEffect, useState, useRef } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { IconContext } from "react-icons";
import { buildPath } from "../Variables/expressServer";
import "../Style/style.css"
import "../Style/App.css";

type songData =
  {
    id: number;
  }

function MusicPlayer(songData: songData) {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [source, setSource] = useState("/concerts/getSongFile?id=-1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [play, { pause, duration, sound }] = useSound("", { volume });
  const [currTime, setCurrTime] = useState({ min: "00", sec: "00" });
  const [seconds, setSeconds] = useState();
  const [time, setTime] = useState({ min: "00", sec: "00" });

  function timeFormatter(timeNum: string): string {
    if (parseInt(timeNum) < 10) {
      return "0" + timeNum;
    }
    return timeNum;
  };

  //Update audio element src when song ID changes.
  useEffect(() => {
    const updateSong = (source: number) => {
      setSource(buildPath('/concerts/getSongFile?id=' + source));
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.load();
      }
    }

    if (songData["id"] == -1) {
      setSource("");
      if (audioElement.current) {
        audioElement.current.pause();
      }
    }
    else {
      updateSong(songData["id"]);
      console.log("Song changed: " + songData["id"]);
    }
  }, [songData]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])); // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60).toString();
        const sec = Math.floor(sound.seek([]) % 60).toString();
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    if (duration) {
      const sec = duration / 1000;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);
      setTime({
        min: min.toString(),
        sec: secRemain.toString()
      });
    }
  }, [duration, isPlaying]);

  const playButton = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    }
    else {
      play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="musicPlayer">
      <div className="time">
        <p>
          {timeFormatter(currTime.min)}:{timeFormatter(currTime.sec)}
        </p>
        <p>
          {timeFormatter(time.min)}:{timeFormatter(time.sec)}
        </p>
      </div>
      <div>
        <input
          type="range"
          min="0"
          //defaultValue="0"
          max={duration ? duration / 1000 : 0}
          value={seconds}
          className="time"
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
      </div>
      <div className="container">
        <div className="row">
          <div className="col">





            <audio controls ref={audioElement} autoPlay={false}>
              <source src={source} type='audio/mpeg' />
            </audio>





            {!isPlaying ? (
              <button className="playButton centerButton" onClick={playButton}>
                <IconContext.Provider value={{ size: "3em", color: "rgb(245, 200, 64)" }}>
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </button>
            ) : (
              <button className="playButton centerButton" onClick={playButton}>
                <IconContext.Provider value={{ size: "3em", color: "rgb(245, 200, 64)" }}>
                  <AiFillPauseCircle />
                </IconContext.Provider>
              </button>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col time">
            <input
              type="range"
              min="0"
              //defaultValue="50"
              max="100"
              value={volume * 100}
              className="time"
              onChange={(e) => {
                console.log("target value is " + e.target.value);
                setVolume(parseInt(e.target.value) / 100);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer;