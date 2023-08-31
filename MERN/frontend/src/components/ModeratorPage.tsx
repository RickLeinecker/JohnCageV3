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

type ModerationList =
{
    userList:User[];
}

class UserList extends Component<ModerationList>
{
    render(): React.ReactNode {
        {
            return <div className="col">
                <input type="text" className="form-control" placeholder="Search user by name or ID" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <br/>
                <div className="scroller">
                {
            
                this.props.userList.map((key,index)=>
                {
                    return <button>
                        
                    </button>
                }
                )
                
                }
                </div>
            </div>
        }
    }
}

class UserCard extends Component
{
    userList:User[] =[{name:"Banana",phoneNumber:"491-232-1499",email:"bananaKing",accountDate:"03-01-23"},{name:"Ronald MgNold",phoneNumber:"123-144-1500",email:"MaotheDemonKing@gmail.com",accountDate:"08-30-23"}];
    render(): React.ReactNode {
        return <div className="card" style={{ width: "100%", height: "100%",backgroundColor: "#D9D9D9" }}>
            <div className="card-body" style ={{left:"25px",right:"25px"}}>
            <div>
              <h3 className="card-title song-name">Steve</h3>
              <h6 className="card-subtitle mb-2" style={{color:"red"}}>HIGHLY REPORTED</h6>
              <div>
                <p>Phone Number: 123-456-7890</p>
                <p>Email: Thebananaking@gmail.com</p>
                <p>Created Account: 03-01-23</p>
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
    userList:User[] =[{name:"Banana",phoneNumber:"491-232-1499",email:"bananaKing",accountDate:"03-01-23"},{name:"Ronald MgNold",phoneNumber:"123-144-1500",email:"MaotheDemonKing@gmail.com",accountDate:"08-30-23"}];
    render()
    {
        return  <div className ="container" style={{padding:" 6% 12%",color:"white"}}>
             <div className="row">
                <div className="col">
                <UserList userList={this.userList}/>
                </div>
                <div className="col">
                <UserList userList={this.userList}/>
                </div>
                <div className="col">
                <UserCard/>
                </div>
             </div>
            </div>
    }
  
  
}

export default ModeratorPage;

