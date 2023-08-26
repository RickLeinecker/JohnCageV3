import "../style/App.css";
import "../style/button.css"
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactAudioPlayer from "react-audio-player";

import {MusicCard} from "./MusicCard";
import { TagCard } from "./TagCard";

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
    tagList:string[] = ["Fruit","Nuts","Spring"];
    boolList:boolean[] = new Array(this.tagList.length);

    render()
    {
        return  <div className ="container">
             <div className ="row">
                <br/>
            </div>
            <div className ="row">
                <div className="col"></div>
                <div className="col-8">
                    <input type="text" className="form-control" placeholder="Search song by tag or name" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                </div>
                <div className="col"></div>
            </div>
            <div className ="row">
                <br/>
            </div>
            <div className ="row">
                    <div className = "col"></div>
                    <div className="col-4 scroller">
                        <div className ="d-grid" role="group" aria-label="Toolbar with button groups">
                        {
                            this.mainList.map((key,i) =>
                            {
                                return <SongButton key ={key} songName ={key} index = {i} isActive = {this.state.activeIndex === i} onClick = {this.handleClick} />
                            }
                            )
                        }
                        </div>
                    </div>
                    <div className = "col-4">
                        <MusicCard songName = {this.mainList[this.state.activeIndex]}/>
                    </div>
                    <div className="col-2">
                        <TagCard tagList={this.tagList} activeTags={this.boolList}/>
                    </div>
                    <div className = "col"></div>
            </div>
            <div className ="row">
                <br/>
            </div>
            {/* <div>
                <ReactAudioPlayer src={this.mainList[this.state.activeIndex]} controls />
            </div> */}
            </div>
    }
  
  
}

export default ConcertPage;

