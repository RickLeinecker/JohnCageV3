import React, { Component } from "react";
import ReactDOM from "react-dom";
import '../style/button.css'; 

type ButtonState = {
    name:string;
    index:number;
    isActive:boolean;
    onClick: Function;
}

class Container extends React.Component {
  state = {
    activeIndex: null
  }

  handleClick = (index:number) => {
    this.setState({ activeIndex: index});
    console.log("New state is "+this.state.activeIndex);
  }


  render() {
    var clickables = [
        { name: "a" },
        { name: "b" },
        { name: "c" },
      ]

    return <div>
        {
            clickables.map((clickables,i) =>
            {
                return <MyClickable key = {clickables.name} name= {clickables.name} index ={i} isActive = {this.state.activeIndex === i} onClick={ this.handleClick }/>
            })
        }
      {/* <MyClickable name="a" index={0} isActive={ this.state.activeIndex===0 } onClick={ this.handleClick } />
      <MyClickable name="b" index={1} isActive={ this.state.activeIndex===1 } onClick={ this.handleClick }/>
      <MyClickable name="c" index={2} isActive={ this.state.activeIndex===2 } onClick={ this.handleClick }/> */}
    </div>
  }
}

class MyClickable extends React.Component<ButtonState> {

  handleClick = () => this.props.onClick(this.props.index)
  
  render() {
    return <button
      type='button'
      className={
        this.props.isActive ? 'active' : 'album'
      }
      onClick={ this.handleClick }
    >
      <span>{ this.props.name }</span>
    </button>
  }
}

export default Container;