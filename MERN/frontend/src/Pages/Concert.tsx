// Style
import "../Style/App.css";
import "../Style/button.css"

// Components
import { Component, useEffect, useState } from "react";
import MusicCard from "../Components/MusicCard";
import { TagCard } from "../Components/TagCard";
import { Form } from "react-bootstrap";

// API functions
import getTags from "../API/getTagsAPI";
import getMetadata from "../API/getMetadataAPI";

// Types
import tagList from "../Types/tagList";
import concertData from "../Types/concertData";
import searchResult from "../Types/searchResult";
import searchSongs from "../API/searchSongsAPI";

//Interfaces/objects
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
function ConcertPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchList, setSearchList] = useState<Array<searchResult>>([{ title: "default", id: -1, tags: [], maestro: "", }]);
    const [activeSelection, setActiveSelection] = useState<number>(-1);
    const [tagList, setTagList] = useState<string[]>(["Tag"]);
    const [activeTagList, setActiveTagList] = useState<boolean[]>([false, false]);
    const [metaData, setMetaData] = useState<concertData>({ id: -1, title: "", date: "", description: "", tags: [""], maestro: "", performers: [""] });

    // Get tags useEffect hook
    useEffect(() => {
        const refreshTags = async function () {
            const newTags: tagList = await getTags();
            setTagList(newTags["tags"]);
            setActiveTagList(newTags["activeList"]);
        }
        refreshTags();
    }, []);

    // Search Text useEffect hook
    useEffect(() => {
        const performSearch = async function (search: string) {
            const newSearch: searchResult[] = await searchSongs(search);
            setSearchList(newSearch);
            setActiveSelection(-1);
        }
        performSearch(searchText);
    }, [searchText]);

    // Get metadata useEffect hook
    useEffect(() => {
        const getSongCardData = async function (songId: number) {
            const data: concertData = await getMetadata(songId);
            setMetaData(data);
        }
        if (searchList[activeSelection]) {
            getSongCardData(searchList[activeSelection].id);
        }
    }, [searchList, activeSelection]);

    return (
        <div className="container" style={{ height: "100vh" }}>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col">
                    <Form.Group>
                        <Form.Control type='searchtext' value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} placeholder="Search performance by name" />
                    </Form.Group>
                    <TagCard tagList={tagList} activeTags={activeTagList} />
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
                                    return <SongButton key={i} songName={key["title"]} index={i} isActive={activeSelection == i} onClick={() => setActiveSelection(i)} />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="col">
                    <MusicCard id={metaData["id"]} title={metaData["title"]} date={metaData["date"]} description={metaData["description"]} tags={metaData["tags"]} maestro={metaData["maestro"]} performers={metaData["performers"]} />
                </div>
            </div>
            <div className="row">
                <br />
            </div>
        </div>
    );
}

export default ConcertPage;

