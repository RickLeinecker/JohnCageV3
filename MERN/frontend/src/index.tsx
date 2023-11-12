import { Component, useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import NavBar from './Components/NavBar';
import reportWebVitals from './reportWebVitals';
import ConcertPage from "./Pages/Concert";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import AboutPage from "./Pages/About";
import RegisterPage from "./Pages/Register";
import CalendarPage from './Pages/Calendar';
import SocketTest from "./Pages/SocketTest"
import LiveConcertCard from "./Components/LiveConcertCard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './Style/index.css';

const Compiled = () => {

  var baseButtonList: string[] = ["Concerts", "Schedule", "About", "Profile"];

  const [userName, setUserName] = useState("");
  const [buttonList, setButtonList] = useState(baseButtonList);

  function LoggingIn(name: string) {
    setUserName(name);
    if (name === "" && buttonList[buttonList.length - 1] == "Logout") {
      console.log("Logging out....");
      localStorage.removeItem("Username");
      buttonList.pop();// Popout Logout
      buttonList.push("Profile");
    }
    else if (buttonList[buttonList.length - 1] == "Profile") {
      console.log("Logging in....");
      buttonList.pop();// Pop out profile then push in logout.
      buttonList.push("Logout");
    }
    console.log("All components will have " + name);
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("Username");
    if (userName === "" && loggedInUser) {
      console.log("Use effect logging in ");
      setUserName(loggedInUser);
      LoggingIn(loggedInUser);
    }
    else if (loggedInUser === null) {
      console.log("Use effect logging out ");
      setUserName("");
      LoggingIn("");
    }
  }, [])

  return (
    <div>
      <BrowserRouter>
        <div className="row">
          <NavBar userName={userName} setterFunction={LoggingIn} buttonList={buttonList} />
        </div>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8" style={{ backgroundColor: "white" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/Concerts" element={<ConcertPage />} />
              <Route path="/Login" element={<LoginPage setUserName={LoggingIn} />} />
              <Route path="/About" element={<AboutPage />} />
              <Route path="/Register" element={<RegisterPage setUserName={LoggingIn} />} />
              <Route path="/Socket" element={<SocketTest />} />
              <Route path="/Schedule" element={<CalendarPage />} />
              <Route path="/Live" element={<LiveConcertCard Title="asfd" Maestro="asf " Tags={['asf', 'as']} Description="adsf" Date="asf" Time="af" />} />
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