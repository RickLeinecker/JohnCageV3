import React, { Component } from "react";
import { createRoot } from 'react-dom/client';
import './style/index.css';
import App from './components/NavBar';
import reportWebVitals from './reportWebVitals';
import NavBar from "./components/NavBar";
import ConcertPage from "./components/ConcertPageStateVariant";
import AppTest from "./components/AppTest"
import HomePage from "./components/HomePage";
import ModeratorPage from "./components/ModeratorPage";
import { create } from "domain";
import { BrowserRouter,Route,Routes } from "react-router-dom"

// const root = ReactDOM.createRoot(
//   document.getElementById('nav') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


class Compiled extends Component {
    state = {
      activePage: 0
  }

  handleClick = (index:number) => {
      this.setState({ activePage: index});
      console.log("Now Selecting"+this.state.activePage);
  }

  render() {
    console.log("Now in "+window.location);

    // switch(window.location.pathname)
    // {
    //     case "/Home":
    //       rendered = <ConcertPage/>
    //       break;
    //     default:
    //       console.log("Uh what to do");
    //       rendered = <AppTest/>
    //       break;
    // }
    return (<div>
      <BrowserRouter>
    <App/>
    <br/>
    <Routes>
    <Route path ="/" element = {<ModeratorPage/>}/>
      <Route path ="/Home" element = {<HomePage/>}/>
      <Route path ="/Concert" element = {<ConcertPage/>}/>
    </Routes>
    </BrowserRouter>
    </div>);
  }
}

// class AudioList extends Component{
//   render(): React.ReactNode {
//       {
//         return <MusicList/>
//       }
//   }
// }

// class Nav extends Component{
//   handleClick()
//   {
    
//   }
//   render() {
//       {
//         return <NavBar changePage={this.handleClick}/>
//       }
//   }
// }

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
musicRoot.render(<Compiled/>);

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
