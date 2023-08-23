import "../style/App.css";
import "../style/button.css"
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactAudioPlayer from "react-audio-player";

import {MusicCard} from "./MusicCard";

type ButtonState = {
  songName:string;
  index:number;
  isActive:boolean;
  onClick: Function;
}

class SongButton extends Component<ButtonState>
{
    nameOfClass:string = "btn "
    handleClick = () => this.props.onClick(this.props.index)
    render(){
        console.log("Current song is "+this.props.index+" and isActive: "+this.props.isActive);
    return <button type="button" className={this.nameOfClass+
        (this.props.isActive ? 'current' : 'inactive')
      }
    onClick ={this.handleClick}>{this.props.songName}</button>;;
    }
}

class ConcertPage extends Component
{
    state = {
        activeIndex: 0
      }
    
    handleClick = (index:number) => {
        this.setState({ activeIndex: index});
        console.log("New state is "+this.state.activeIndex);
    }

    mainList:string[] = ["/alarm.wav", "/bark.wav", "/reverb.wav", "/trap.mp3"];

    render()
    {
        return <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
            <div className ="btn-group-vertical" role="group">
            {
                this.mainList.map((key,i) =>
                {
                    return <SongButton key ={key} songName ={key} index = {i} isActive = {this.state.activeIndex === i} onClick = {this.handleClick} />
                }
                )
            }
        </div>
            <MusicCard songName = {this.mainList[this.state.activeIndex]}/>
        <div>
            <ReactAudioPlayer src={this.mainList[this.state.activeIndex]} controls />
        </div>
        </div>
    }
  
  
}

export default ConcertPage;

