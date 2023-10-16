import { Component , useState, useEffect} from "react";
import { createRoot } from 'react-dom/client';
import NavBar from './Components/NavBar';
import reportWebVitals from './reportWebVitals';
import ListenPage from "./Pages/Listen";
import RecordPage from "./Pages/Record";
import ConcertPage from "./Pages/Concert";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import AboutPage from "./Pages/About";
import RegisterPage from "./Pages/Register";
import CalendarPage from './Pages/Calendar';
import SocketTest from "./Pages/SocketTest"
import { BrowserRouter, Route, Routes} from "react-router-dom";
import './Style/index.css';
import WebSocketTest from "./Pages/WebSocketTest";

const Compiled = () => {

  var baseButtonList: string[] = ["Concerts", "About", "Calendar", "WebSocket", "WebSocketTest", "Login", "Register"];

  const [userName, setUserName] = useState("");
  const [buttonList,setButtonList] = useState(baseButtonList);
  
  function LoggingIn(name:string)
  {
    setUserName(name);
    if (name === "" && buttonList.length < 7)
    {
      console.log("Logging out....");
      localStorage.removeItem("Username");
      buttonList.pop();
      buttonList.push("Login");
      buttonList.push("Register");
    }
    else if (buttonList.length > 6)
    {
      console.log("Logging in....");
      buttonList.pop();
      buttonList.pop();
      buttonList.push("Logout");
    }
    console.log("All components will have "+name);
  }

  useEffect(() =>{
    const loggedInUser = localStorage.getItem("Username");
    if (userName === "" && loggedInUser)
    {
      console.log("Use effect logging in ");
      setUserName(loggedInUser);
      LoggingIn(loggedInUser);
    }
    else if (loggedInUser === null)
    {
      console.log("Use effect logging out ");
      setUserName("");
      LoggingIn("");
    }
  },[])

    return (
      <div>
        <BrowserRouter>
          <div className="row">
            <NavBar userName={userName} setterFunction={LoggingIn} buttonList={buttonList}/>
          </div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8" style={{ backgroundColor: "white" }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Home" element={<HomePage />} />
                <Route path="/Concerts" element={<ConcertPage />} />
                <Route path="/Record" element={<RecordPage />} />
                <Route path="/Listen" element={<ListenPage />} />
                <Route path="/Login" element={<LoginPage setUserName={LoggingIn} />} />
                <Route path="/About" element={<AboutPage />} />
                <Route path="/Register" element={<RegisterPage setUserName={LoggingIn}/>} />
                <Route path="/WebSocket" element={<SocketTest />} />
                <Route path="/Calendar" element={<CalendarPage />} />
                <Route path="/WebSocketTest" element={<WebSocketTest />} />
              </Routes>
            </div>
            <div className="col-2"></div>
          </div>
        </BrowserRouter>
      </div>
    );
}

const musicElement = document.getElementById("musicMenu");
const musicRoot = createRoot(musicElement!);
musicRoot.render(<Compiled />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




/* Old index
import React from 'react';
import ReactDOM from 'react-dom/client';
import ConcertPage from './Pages/ConcertPage';
import Catalogue from './Pages/Catalogue';
import Record from './Pages/Record';
import Listen from './Pages/Listen';
import Home from './Pages/Home';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ConcertPage />} />
      <Route path="/record" element={<Record />} />
      <Route path="/listen" element={<Listen />} />
      <Route path="/catalogue" element={<Catalogue />} />
    </Routes>
  </BrowserRouter>
);

//Remove strictmode to prevent useEffect hooks from triggering twice (it loads components twice to detect problems)
//<React.StrictMode>
//</React.StrictMode>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/