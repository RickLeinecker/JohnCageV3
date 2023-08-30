import { useEffect, useState } from 'react';
import { Card, Row, Form } from "react-bootstrap";
import ReactAudioPlayer from "react-audio-player";

//Interfaces
interface result {
  title: string,
  id: number
}

//Functions
function buildPath(route: String) {
  return 'http://localhost:5000/' + route;
}

function Catalogue() {

  const [searchText, setSearchText] = useState<string>('');
  const [searchList, setSearchList] = useState<Array<result>>([{ title: 'defaultTitle', id: 1 }]);

  useEffect(() => {
    const performSearch = async function () {
      try {
        //Get recording metadata according to search text
        const response = await fetch(buildPath('api/searchSongs?search=' + searchText), { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        console.log("Fetch requrest URL: ", buildPath('api/searchSongs?search=' + searchText));
        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const searchResults = sd.searchResults;

        //Save metadata to "result" interface array
        var searchTemp: result[] = [];
        for (var i = 0; i < searchResults.length; ++i) {
          searchTemp.push({ title: searchResults[i].Title, id: searchResults[i].ID });
        }

        //Save metadata to page for display
        console.log("SearchResults: ", searchTemp);
        setSearchList(searchTemp);
      }
      catch (e) {
        if (e instanceof Error) {
          alert(e.toString());
        }
        return;
      }
    };

    console.log("Search Text: ", searchText);
    performSearch();
  }, [searchText]);

  return (
    <div className="Catalogue Page">
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Card.Title>Catalogue Page</Card.Title>
        <Card.Body>
          <Form.Group>
            <Form.Control type='searchtext' value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} placeholder="Search" />
          </Form.Group>

          <div className="Audio List">
            {searchList.map((key, index) => {
              return (
                <Row>
                  <Card style={{ width: '18rem' }}>
                    <Card.Body>
                      <Card.Title>{searchList[index].title}</Card.Title>
                      <ReactAudioPlayer src={'http://localhost:5000/api/getSong?id=' + String(searchList[index].id)} controls />
                    </Card.Body>
                  </Card>
                </Row>
              );
            })}
          </div>

        </Card.Body>
      </Card>
    </div>
  );
}

export default Catalogue;
