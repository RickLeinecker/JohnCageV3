import React, { Component, useEffect, useState} from "react";
import { Nav, Container, Navbar } from "react-bootstrap";
import { Link, useLocation, useMatch } from "react-router-dom";
import PropTypes from 'prop-types';
import '../Style/text.css';
import navBarData from "../Types/navBarData";
import ProfileButton from "./ProfileDropDown";

type NavButton = {
  buttonName: string;
}

type LogOut = {
  logOut:Function;
}

type LinkList = {
  buttonList:string[];
}

class NavButtons extends Component<NavButton>{

  goTo: string = "/" + this.props.buttonName;
  nameOfClass: string = "nav-link ";

  render() {
    return <li className="nav-item">
      <Link className={this.nameOfClass} aria-current="page" to={this.goTo}>
        {this.props.buttonName}
      </Link>
    </li>
  }
}

class LogOutButton extends Component<LogOut>{
  render ()
  {
    return <button onClick = {() => this.props.logOut("")}> Logout</button>
  }
}

function LogoutDisplay(userName:string, logOutFunc:Function, )
{
  return <div>
    <p>Welcome {userName}</p>
    <LogOutButton logOut={logOutFunc}/>
  </div>
}

const NavBar =({userName, setterFunction, buttonList}:navBarData) => {
    const [LoginMode,setLoginMode] = useState(userName);

     //const buttonList: string[] = ["Concerts", "About", "Calendar", "WebSocket", "WebSocketTest", "Register"];
    

    return (
      <Navbar
        className="navbar navbar-expand-sm navbar-light"
        style={{ backgroundColor: "#d3b035" }}
        expand="lg"
      >
        <Container>
          <Navbar.Brand>
            <h2>
              <Link style={{ textDecoration: 'none' }} className="text" aria-current="page" to={"/"}>
                {"John Cage Tribute"}
              </Link>
            </h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <br />
            <Nav className="me-auto">
              {
                buttonList.map((key, i) => {
                  if (key === "Logout")
                    return LogoutDisplay(userName,setterFunction as Function);
                  else if(key === "Profile")
                    return <ProfileButton key={i} />;
                  else
                    return <NavButtons key={i} buttonName={key} />
                }
                )
              }
              {}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}


export default NavBar;
