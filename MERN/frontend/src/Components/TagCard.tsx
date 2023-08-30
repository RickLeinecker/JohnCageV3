import React, { Component } from "react";
import "../Style/button.css"
import "../Style/App.css";
import { useState } from 'react';

type Tags = {
  tagList: string[]
  activeTags: boolean[]
}

type TagButtons = {
  isActive: boolean
  tagName: string
  toggleFunction: Function
  index: number
}

class TagButton extends Component<TagButtons>
{
  nameOfClass: string = "btn "
  state = {
    activeTag: false,
  };

  handleClick = () => {
    this.setState({
      activeTag: !(this.props.isActive)
    });
    this.props.toggleFunction(this.props.index);
    console.log("The tag is now " + this.state.activeTag);
  };

  render() {
    return <button type="button" className={this.nameOfClass + (this.state.activeTag ? 'activeTag' : 'inactiveTag')}
      onClick={this.handleClick}>{this.props.tagName}</button>;;
  }
}

export class TagCard extends Component<Tags> {

  state = {
    activeIndex: 0
  }

  handleClick = (index: number) => {
    console.log("Setting tag at index: " + index + " to: " + this.props.activeTags[index]);
    if (this.props.activeTags[index]) {
      this.props.activeTags[index] = false
    }
    else {
      this.props.activeTags[index] = true
    }
    console.log("Tag at index: " + index + " is now: " + this.props.activeTags[index]);
    this.setState({ activeIndex: index });
  }
  render() {
    return (
      <React.Fragment>
        <div
          className="card"
          style={{ width: "100%", height: "100%", backgroundColor: "#D9D9D9" }}
        >
          <div className="card-body">
            <h5 className="card-title song-name">Filter by Tags</h5>

            <div style={{ position: "relative", bottom: "0px", margin: "25%" }} className="btn-group-vertical">
              {this.props.tagList.map((key, i) => {
                return <TagButton index={i} tagName={key} isActive={this.props.activeTags[i]} toggleFunction={this.handleClick} />
              }
              )
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // setMetaData(name: string) {
  //   songName = name;
  // }
}

