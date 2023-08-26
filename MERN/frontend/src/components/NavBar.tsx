import React, { Component } from "react";

type ComponentPage = {
  changePage?:Function;
}

type NavButton = {
  changePage:Function;
  index:number;
}

class NavButtons extends Component<NavButton>{

  render(){
    return <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">
                    Home
                  </a>
                </li>
  }

}


class NavBar extends Component<ComponentPage> {
  render() {
    return (
      <React.Fragment>
        <nav
          className="navbar navbar-expand-sm navbar-light"
          style={{ backgroundColor: "#d3b035" }}
        >
          <div className="container-fluid">
            <div className="row">
            <h2>John Cage Tribute</h2>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <br />
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="nav navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="#">
                    Concert
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Schedule
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default NavBar;
