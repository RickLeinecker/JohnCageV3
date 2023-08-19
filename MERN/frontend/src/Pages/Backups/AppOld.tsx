//Misc Libraries
import { useState, useEffect, useRef } from 'react';
import './CSS/App.css';
import ReactAudioPlayer from "react-audio-player";
import { Row, Form, Card, Button } from "react-bootstrap";
import io from 'socket.io-client';

//Socket connection and some socket code
let socket: any;
socket = io("http://localhost:5001");
socket.on('receiveGreet', (data: String) => {
  console.log('data::', data);
});

//Interfaces
interface result {
  title: string,
  id: number
}

//Functions
function buildPath(route: String) {
  return 'http://localhost:5000/' + route;
}

function App() {
  const [searchList, setSearchList] = useState<Array<result>>([{ title: 'defaultTitle', id: 1 }]);
  const [searchText, setSearchText] = useState<string>('');

  //Audio recording test -------------------
  var recordedAudio = useRef<HTMLAudioElement>();
  var rec = useRef<MediaRecorder>();
  var audioChunks = [];
  
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { handlerFunction(stream) });

  const startRecording = async function () {
    console.log("Recording started.");
    rec.current.start();
  }

  const stopRecording = async function () {
    console.log("Recording stopped.");
    rec.current.stop();
  }

  function handlerFunction(stream) {
    rec.current = new MediaRecorder(stream);


    var piushed = 1;
    rec.current.ondataavailable = e => {
      audioChunks.push(e.data);
      if (piushed == 1) {
        var blob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
        recordedAudio.current.src = URL.createObjectURL(blob);
        //recordedAudio.current.controls = true;
        //recordedAudio.current.autoplay = true;
        recordedAudio.current.play();
        piushed = 0;
      }
      if (rec.current.state == "inactive") {
        console.log("inactive");

        // if (recordedAudio.current) {

        // }
      }
    }
  }
  //End Audio recording test ---------------




  useEffect(() => {
    const performSearch = async function () {
      try {
        //Get recording metadata according to search text
        const response = await fetch(buildPath('api/searchSongs?search=' + searchText), { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        console.log(buildPath('api/searchSongs?search=' + searchText));
        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const searchResults = sd.searchResults;

        //Save metadata to "result" interface array
        var searchTemp: result[] = [];
        for (var i = 0; i < searchResults.length; ++i) {
          searchTemp.push({ title: searchResults[i].Title, id: searchResults[i].ID });
        }

        //Save metadata to page for display
        console.log(searchTemp);
        setSearchList(searchTemp);
      }
      catch (e) {
        if (e instanceof Error) {
          alert(e.toString());
        }
        return;
      }
    };

    socket.emit('input', { data: searchText }, (error: Error) => {
      console.log('error::', error);
    });

    console.log(searchText);
    //performSearch();
  }, [searchText]);

  return (
    <div className="Search Page">
      <div className="Audio Recording">
        <Row>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Record Audio</Card.Title>
              <Button onClick={() => startRecording()}>Start</Button>
              <Button onClick={() => stopRecording()}>Stop</Button>
              <audio preload='auto' ref={recordedAudio} controls={true} autoPlay={true}></audio>
            </Card.Body>
          </Card>
        </Row>
      </div>
    </div>
  );
}

export default App;

/*
var audioContext = new window.AudioContext();
socket.on('playaudio', function(audioData) {
  console.log(audioData);
  var blob = new Blob([audioData], { 'type' : 'audio/webm;codecs=opus' });
  var audio = document.createElement('audio');
  audio.src = window.URL.createObjectURL(blob);
  audio.play();
});
*/

/* Removed to clean up test area for audio recording aspect.
 <h1>Search for a Recording</h1>
      <Form.Group>
        <Form.Control type='searchtext' value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} placeholder="Search" />
      </Form.Group>
  <div className="Audio List">
        {searchList.map((key, index) => {
          return (
            <Row>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{searchList[index].title}</Card.Title>
                  <ReactAudioPlayer src={'http://localhost:5000/api/getSong?id=' + String(searchList[index].id)} controls />
                </Card.Body>
              </Card>
            </Row>
          );
        })}
      </div>
*/

//Unused, based on working examples. Replaced to fix typescript issues even though I don't know what I am doing.
//Replaced with in line setState:
//onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)}
/*
const SearchChangeHandler = (event: Event) => {
  event.preventDefault();
  if (event.target != null) {
    setSearchText((event.target as HTMLTextAreaElement).value);

  }
};
*/