import React, { Component } from "react";
import {Link,useLocation, useMatch} from "react-router-dom"
import PropTypes from 'prop-types'

type NavButton = {

  buttonName:string;
}

class NavButtons extends Component<NavButton>{

  goTo:string = "/"+this.props.buttonName;
  nameOfClass:string = "nav-link ";

  // location = useLocation();
  // isActive = useMatch({path:this.location.pathname, end:true})

  render(){
    return <li className="nav-item">
                  <Link className={this.nameOfClass} aria-current="page" to={this.goTo}>
                    {this.props.buttonName}
                  </Link>
                </li>
  }

}




class NavBar extends Component {

  buttonList:string[] = ["Home", "Concert","Schedule","Register","Login"];
  

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
                {
                this.buttonList.map((key,i) =>
                {
                    return <NavButtons key ={i} buttonName={key}/>
                }
                )
                }
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}


export default NavBar;
