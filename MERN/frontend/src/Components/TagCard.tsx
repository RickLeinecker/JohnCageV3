import React, { Component } from "react";
import "../Style/button.css"
import "../Style/App.css";
import Tag from "../Types/Tag";

type Tags = {
  tagList: Tag[];
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
    //console.log("Setting tag at index: " + index + " to: " + this.props.tagList[index].active);
    if (this.props.tagList[index].active == true) {
      this.props.tagList[index].active = false;
    }
    else {
      this.props.tagList[index].active = true;
    }
    //console.log("Tag at index: " + index + " is now: " + this.props.tagList[index].active);
    this.setState({ activeIndex: index });
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="card"
          style={{ width: "100%", height: "50%", backgroundColor: "#D9D9D9" }}
        >
          <div className="btn-group-horizontal">
            {
              this.props.tagList.map((key, i) => {
                return <TagButton key={i} index={i} tagName={key.tag} isActive={key.active} toggleFunction={this.handleClick} />
              })
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

