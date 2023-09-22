import { useEffect, useState, useRef } from "react";
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
  const [trackVolume, setTrackVolume] = useState(1);
  const [trackTime, setTrackTime] = useState({ min: "00", sec: "00" });
  const [trackLength, setTrackLength] = useState({ min: "00", sec: "00" });

  //Update audio element src when song ID changes.
  useEffect(() => {
    const updateSong = (source: number) => {
      setSource(buildPath('/concerts/getSongFile?id=' + source));
      if (audioElement.current) {
        pause(audioElement.current);
        audioElement.current.load();
      }
    }

    if (songData["id"] == -1) {
      setSource("");
      if (audioElement.current) {
        pause(audioElement.current);
      }
    }
    else {
      updateSong(songData["id"]);
    }

  }, [songData]);

  // Functions dependent on the audioElement reference or HTML audio element itself:
  const seek = function (seconds: number) {
    if (audioElement.current) {
      audioElement.current.currentTime = seconds;
      setTrackTime(getTrackTime(audioElement.current));
    }
  }

  const pause = function (audio: HTMLAudioElement) {
    if (audioElement.current) {
      setIsPlaying(false);
      audio.pause();
    }
  }

  const play = function (audio: HTMLAudioElement) {
    if (audioElement.current) {
      setIsPlaying(true);
      audio.play();
    }
  }

  const updateVolume = function (volume: number) {
    if (audioElement.current) {
      audioElement.current.volume = volume;
      setTrackVolume(volume);
    }
  }

  const updateTimeDisplay = function () {
    if (audioElement.current) {
      setTrackTime(getTrackTime(audioElement.current));
    }
  }

  const handlePlayButton = () => {
    if (audioElement.current) {
      // This should be moved somewhere that will trigger once audio metadata loaded instead of when play pressed.
      setTrackLength(getTrackDuration(audioElement.current));
      //
      if (isPlaying) {
        pause(audioElement.current);
      }
      else {
        play(audioElement.current);
      }
    }
  };

  const handleEnded = function () {
    if (audioElement.current) {
      pause(audioElement.current);
    }
  }

  // Generic functions:
  const getMinutesSeconds = function (seconds: number) {
    let formattedMinutes = String(Math.floor(seconds / 60));
    let formattedSeconds = String(Math.floor(seconds - (parseInt(formattedMinutes) * 60)));
    if (parseInt(formattedSeconds) < 10) {
      let zero = "0";
      formattedSeconds = zero + formattedSeconds;
    }
    return ({ min: formattedMinutes, sec: formattedSeconds });
  }

  const getTrackTime = function (audio: HTMLAudioElement) {
    return getMinutesSeconds(audio.currentTime);
  }

  const getTrackDuration = function (audio: HTMLAudioElement) {
    return getMinutesSeconds(audio.duration);
  }

  // JSX
  return (
    <div className="musicPlayer">
      <div className="time">
        <p>
          {trackTime.min}:{trackTime.sec}
        </p>
        <p>
          {trackLength.min}:{trackLength.sec}
        </p>
      </div>
      <div>
        <input
          type="range"
          min="0"
          max={audioElement.current?.duration ? audioElement.current?.duration : 0}
          value={audioElement.current?.currentTime}
          className="time"
          onChange={(e) => { seek(parseInt(e.target.value)); }}
        />
      </div>
      <div className="container">
        <div className="row">
          <div className="col">

            <audio controls hidden={true} onEnded={handleEnded} onTimeUpdate={updateTimeDisplay} ref={audioElement} autoPlay={false}>
              <source src={source} type='audio/mpeg' />
            </audio>

            {!isPlaying ? (
              <button className="playButton centerButton" onClick={handlePlayButton}>
                <IconContext.Provider value={{ size: "3em", color: "rgb(245, 200, 64)" }}>
                  <AiFillPlayCircle />
                </IconContext.Provider>
              </button>
            ) : (
              <button className="playButton centerButton" onClick={handlePlayButton}>
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
              max="100"
              value={trackVolume * 100}
              className="time"
              onChange={(e) => { updateVolume(parseInt(e.target.value) / 100); }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer;
