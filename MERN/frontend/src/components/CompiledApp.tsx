import React, { Component } from 'react';
import '../style/App.css';
import AudioList from "./AudioList";
import ConcertPage from "./ConcertPageStateVariant"
import NavBar from './NavBar';

class App extends Component{
    // state = {
    //     activePage: 0
    // }

    // handleClick = (index:number) => {
    //     this.setState({ activePage: index});
    //     console.log("Now Selecting"+this.state.activePage);
    // }

    render(){
    return (
        <div className="App">
            {/* <NavBar changePage={this.props.changePage}/> */}

        <ConcertPage/>
        </div>
    );
}
}

export default App;
