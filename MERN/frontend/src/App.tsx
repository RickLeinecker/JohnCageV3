import React, { useState, useEffect } from 'react';
import './App.css';
import ReactAudioPlayer from "react-audio-player";
import { Container, Row, Form, Card, Col, Dropdown, ButtonGroup, Button, Table, Modal } from "react-bootstrap";
//import Collapsible from "react-collapsible";

interface result {
  name: string,
  id: number
}

function buildPath(route) {
  return 'http://localhost:5000/' + route;
}

function App() {
  const [searchList, setSearchList] = useState<Array<result>>([{ name: 'one', id: 1 }]);
  const [searchText, setSearchText] = useState<string>('');

  const performSearch = async function () {
    try {
      //Get recording metadata according to search text
      const response = await fetch(buildPath('api/searchSongs?search=' + searchText), { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      console.log(buildPath('api/searchSongs?search=' + searchText));
      var res = JSON.parse(await response.text());
      var sd = JSON.parse(JSON.stringify(res));
      const searchResults = sd.searchResults;

      //Save metadata to "result" interface array
      var searchTemp: result[] = [];
      for (var i = 0; i < searchResults.length; ++i) {
        searchTemp.push({ name: searchResults[i].Title, id: searchResults[i].ID });
      }

      //Save metadata to page for display
      console.log(searchTemp);
      setSearchList(searchTemp);
    }
    catch (e) {
      alert(e.toString());
      return;
    }
  };

  const SearchChangeHandler = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
  };

  useEffect(() => {
    performSearch();
  }, [searchText]);

  return (
    <div className="Search Page">
      <h1>Search for a Recording</h1>
      <Form.Group>
        <Form.Control type='searchtext' value={searchText} onChange={SearchChangeHandler} placeholder="Search" />
      </Form.Group>

      <div className="Audio List">
        {searchList.map((key, index) => {
          return (
            <Row>
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{searchList[index].name}</Card.Title>
                  <ReactAudioPlayer src={'http://localhost:5000/api/getSong?id=' + String(searchList[index].id)} controls />
                </Card.Body>
              </Card>
            </Row>
          );
        })}
      </div>
    </div>
  );
}

export default App;