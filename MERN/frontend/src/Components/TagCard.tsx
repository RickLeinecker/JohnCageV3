import React, { Component } from "react";
import "../Style/button.css"
import "../Style/App.css";
import tag from "../Types/tag";
import { useEffect, useState, useRef } from "react";

type TagCardProps = {
  tagList: tag[];
  tagListHandler: (values: any) => void;
  tagQueue: tag[];
  tagQueueHandler: (values: any, valuess: any, value: any) => void;
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
      //activeTag: !(this.props.isActive)
    });
    this.props.toggleFunction(this.props.index);
    console.log("Tag is " + this.state.activeTag);
  };

  render() {
    return <button type="button" className={this.nameOfClass + (this.state.activeTag ? 'activeTag' : 'inactiveTag')}
      onClick={this.handleClick}>{this.props.tagName}</button>;
  }
}

const TagCard = function (TagCardProps: TagCardProps) {

  const [dequeuedIndex, setDequeuedIndex] = useState<number>(0);

  const handleClick = (index: number) => {

    console.log("DDDDDDDDDD")

    if (TagCardProps.tagList[index].active == true) {
      //TagCardProps.tagList[index].active = false;
    }
    else {
      TagCardProps.tagQueueHandler(TagCardProps.tagList, TagCardProps.tagQueue, TagCardProps.tagList[index]);
      //TagCardProps.tagList[index].active = true;
    }

    console.log(TagCardProps.tagQueue);

    TagCardProps.tagListHandler(TagCardProps.tagList);
  }

  return (
    <React.Fragment>
      <div
        className="card"
        style={{ width: "100%", height: "50%", backgroundColor: "#D9D9D9" }}
      >
        <div className="btn-group-horizontal">
          {
            TagCardProps.tagList.map((key, i) => {
              return <TagButton key={i} index={i} tagName={key.tag} isActive={TagCardProps.tagList[i].active} toggleFunction={handleClick} />
            })
          }
        </div>
      </div>
    </React.Fragment>
  );
}

export default TagCard;

