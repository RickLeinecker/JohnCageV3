import "../Style/App.css";
import "../Style/button.css"
import { Component, useEffect, useState } from "react";
import MusicCard from "../Components/MusicCard";
import { TagCard } from "../Components/TagCard";
import { Form } from "react-bootstrap";


//Interfaces/objects
interface result {
    title: string,
    id: number
}

type ButtonState = {
    songName: string;
    index: number;
    isActive: boolean;
    onClick: Function;
}

class SongButton extends Component<ButtonState>
{
    nameOfClass: string = "btn "
    handleClick = () => this.props.onClick(this.props.index)
    render() {
        return <button type="button" className=
            {this.nameOfClass + (this.props.isActive ? 'current' : 'inactive')}
            onClick={this.handleClick}>
            {this.props.songName}
        </button>;;
    }
}

//Functions
function buildPath(route: String) {
    return 'http://localhost:5000/' + route;
}

function ConcertPage() {

    const mainList: string[] = ["/alarm.wav", "/bark.wav", "/reverb.wav", "/trap.mp3"];
    const tagList: string[] = ["Fruit", "Nuts", "Spring"];
    const boolList: boolean[] = new Array(tagList.length);

    const searchResults =
    [
        {
            id: 1,
            maestro: "Paul",
            performers: ["Kyle", "Paul", "Stephen", "Rayyan", "Himil"],
            title: "Concert: One",
            tags: ["Slow", "Quiet", "Loud"],
            description: "High intensity pipe action yahoo.",
            date: "2023-September-11-6-00-PM"
        },
        {
            id: 2,
            maestro: "Paul",
            performers: ["Kyle", "Paul"],
            title: "Concert: Two",
            tags: ["Fast", "Hard"],
            description: "High intensity Green Hills. Gotta go fast!",
            date: "2023-September-13-6-00-PM"
        }
    ]


    const [searchText, setSearchText] = useState<string>('');
    const [searchList, setSearchList] = useState<Array<result>>(searchResults);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleIndexChange = function (num: number) {
        setActiveIndex(num);
        console.log("Active index should be: ", num);
    }

    // Search Text useEffect hook
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
                handleIndexChange(0);
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
        <div className="container" style ={{height:"100vh"}}>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col">
                    <Form.Group>
                        <Form.Control type='searchtext' value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} placeholder="Search performance by name" />
                    </Form.Group>
                    <TagCard tagList={tagList} activeTags={boolList}/>
                </div>
            </div>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col">
                    <div className="scroller">
                    <div className="d-grid" role="group" aria-label="Toolbar with button groups">
                        {
                            searchList.map((key, i) => {
                                return <SongButton songName={key.title} index={i} isActive={activeIndex == i} onClick={() => handleIndexChange(i)} />
                            }
                            )
                        }
                       </div> 
                    </div>
                    
                </div>
                <div className="col">
                    <MusicCard songName={searchList[activeIndex].title} tagList={searchResults[activeIndex].tags} />
                </div>
            </div>
            <div className="row">
                <br />
            </div>
        </div>
    );
}

export default ConcertPage;

