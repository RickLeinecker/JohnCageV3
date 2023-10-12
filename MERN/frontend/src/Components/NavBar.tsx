import React, { Component } from "react";
import { Nav, Container, Navbar } from "react-bootstrap";
import { Link, useLocation, useMatch } from "react-router-dom";
import PropTypes from 'prop-types';
import '../Style/text.css';


type NavButton = {
  buttonName: string;
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

class NavBar extends Component {

  buttonList: string[] = ["Concerts", "About", "Calendar", "WebSocket", "WebSocketTest","Login","Register"];

  render() {
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
                this.buttonList.map((key, i) => {
                  return <NavButtons key={i} buttonName={key} />
                }
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}


export default NavBar;
