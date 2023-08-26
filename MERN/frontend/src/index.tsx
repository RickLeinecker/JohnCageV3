import React, { Component } from "react";
import { createRoot } from 'react-dom/client';
import './style/index.css';
import App from './components/NavBar';
import reportWebVitals from './reportWebVitals';
import NavBar from "./components/NavBar";
import ConcertPage from "./components/ConcertPageStateVariant";
import AppTest from "./components/AppTest"
import AppCompiled from "./components/CompiledApp"
import { create } from "domain";

// const root = ReactDOM.createRoot(
//   document.getElementById('nav') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


class X extends Component {
  render() {
    return <App />;
  }
}

// class AudioList extends Component{
//   render(): React.ReactNode {
//       {
//         return <MusicList/>
//       }
//   }
// }

class Nav extends Component{
  render() {
      {
        return <NavBar/>
      }
  }
}

class Concert extends Component {
  render() {
    return <ConcertPage />;
  }
}

class ButtonState extends Component{
  render(): React.ReactNode {
      {
        return <AppTest/>;
      }
  }
}

// const navElement = document.getElementById("nav");
// const navRoot = createRoot(navElement!);
// navRoot.render(<Nav/>);

const musicElement = document.getElementById("musicMenu");
const musicRoot = createRoot(musicElement!);
musicRoot.render(<AppCompiled/>);

// const insertTest = document.getElementById("insertTest");
// const insertRoot = createRoot(insertTest!);
// insertRoot.render(<ButtonState />);
// const musicElement = document.getElementById("musicList");
// ReactDOM.render(<AudioList />, musicElement);
// const cardElement = document.getElementById("metaCard");
// ReactDOM.render(<Card />, cardElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
