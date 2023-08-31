import "../style/App.css";
import "../style/button.css"
import React, { Component } from "react";

interface User
{
    name:string;
    phoneNumber:string;
    email:string;
    accountDate:string;
}

type ModButton =
{
    userData:User;
    isActive:boolean;
    onClick: Function;
    index:number;
}

type TakeUserData =
{
    userData:User;
}

class UserButton extends Component<ModButton>
{
    handleClick = () => this.props.onClick(this.props.index)
    nameOfClass:string = "btn "
    render(): React.ReactNode {
        {
            return <button type="button" className={this.nameOfClass+
                (this.props.isActive ? 'current' : 'inactive')
              }
            onClick ={this.handleClick}>{this.props.userData.name}</button>;;
        }
    }
}

class UserCard extends Component<TakeUserData>
{
    userList:User[] =[{name:"Banana",phoneNumber:"491-232-1499",email:"bananaKing",accountDate:"03-01-23"},{name:"Ronald MgNold",phoneNumber:"123-144-1500",email:"MaotheDemonKing@gmail.com",accountDate:"08-30-23"}];
    render(): React.ReactNode {
        return <div className="card" style={{ width: "100%", height: "100%",backgroundColor: "#D9D9D9" }}>
            <div className="card-body" style ={{left:"25px",right:"25px"}}>
            <div>
              <h3 className="card-title song-name">{this.props.userData.name}</h3>
              <h6 className="card-subtitle mb-2" style={{color:"red"}}>HIGHLY REPORTED</h6>
              <div>
                <p>Phone Number: {this.props.userData.phoneNumber}</p>
                <p>Email: {this.props.userData.email}</p>
                <p>Created Account: {this.props.userData.accountDate}</p>
              </div>
            </div>

            <div style = {{position: "absolute", bottom: "15px"}}>
            <button type="button" className="btn current">
              Reports
            </button>
            <button type="button" className="btn btn-danger">
              Take Action
            </button>
            <br/><br/>
            </div>
          </div>
        </div>
    }
}


class ModeratorPage extends Component
{
    state = {
        activeIndex: 0
      }
      handleClick = (index:number) => {
        this.setState({ activeIndex: index});
        console.log("New state is "+this.state.activeIndex);
    }
    userList:User[] =[{name:"Banana",phoneNumber:"491-232-1499",email:"bananaKing",accountDate:"03-01-23"},{name:"Ronald MgNold",phoneNumber:"123-144-1500",email:"MaotheDemonKing@gmail.com",accountDate:"08-30-23"}];
    render()
    {
        return  <div className ="container" style={{padding:" 6% 12%",color:"white"}}>
             <div className="row">
             <div className="col-4">
                <input type="text" className="form-control" placeholder="Search user by name or ID" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <br/>
                <div className="scroller">    
                <div className ="d-grid" role="group" aria-label="Toolbar with button groups">
                {
                    this.userList.map((key,i) =>
                    {
                        return <UserButton index ={i} userData={key} isActive = {this.state.activeIndex === i} onClick={this.handleClick}/>
                    }
                    )
                }
                </div>
                </div>
            </div>
                <div className="col-4">
                <input type="text" className="form-control" placeholder="Search user by name or ID" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <br/>
                <div className="scroller">    
                <div className ="d-grid" role="group" aria-label="Toolbar with button groups">
                {
                    this.userList.map((key,i) =>
                    {
                        return <UserButton index ={i} userData={key} isActive = {this.state.activeIndex === i} onClick={this.handleClick}/>
                    }
                    )
                }
                </div>
                </div>
                </div>
                <div className="col">
                <UserCard userData={this.userList[this.state.activeIndex]}/>
                </div>
                </div>
             </div>
    }
  
  
}

export default ModeratorPage;

