// Style
import "../Style/App.css";
import "../Style/button.css"

// Components
import { Component, useEffect, useState } from "react";
import MusicCard from "../Components/MusicCard";
import { Form } from "react-bootstrap";
import Modal from "../Components/Modal";

// API functions
import getMetadata from "../API/getMetadataAPI";

// Types
import concertData from "../Types/concertData";
import searchResult from "../Types/searchResult";
import searchSongs from "../API/searchSongsAPI";

// Just there
import React from "react";


//Interfaces/objects
type ButtonState = {
    songName: string;
    tagList: string[];
    index: number;
    isActive: boolean;
    onClick: Function;
}

var Results: searchResult[] = [{
    id: 0,
    title: "Test",
    tags: ["Pie", "Cookies"],
    maestro: "Kyle"
},
{
    id: 1,
    title: "Example",
    tags: ["Pie", "Cookies"],
    maestro: "Kyle"
}
];

function TagsString(tags:string[]):string
{
    if (tags.length < 1)
        return ""
    let tagString:string = tags[0];

    for (let i = 1; i < tags.length; i++)
    {
        tagString += ", "+tags[i];
    }

    return tagString;

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

class SongCard extends Component<ButtonState>
{
    handleClick = () => this.props.onClick(this.props.index)

    render()
    {
        return <div className="card" style={{width: "18rem"}}>
        <div className="card-body">
          <h5 className="card-title">{this.props.songName}</h5>
          <p className="card-text">Tags: {
            TagsString(this.props.tagList)
          }</p>
          <a onClick={this.handleClick} className="btn btn-primary">Play Concert</a>
        </div>
      </div>
    }
}

//Functions
function ConcertPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchList, setSearchList] = useState<Array<searchResult>>(Results);
    const [activeSelection, setActiveSelection] = useState<number>(-1);
    const [metaData, setMetaData] = useState<concertData>({ id: -1, title: "", date: "", description: "", tags: [""], maestro: "", performers: [""] });
    const [isOpen,setIsOpen] = useState(false);

    function onClickCompound(index:number, open:boolean)
    {
        setActiveSelection(index);
        setIsOpen(open);
    }

    // Search Text useEffect hook
    // useEffect(() => {
    //     const performSearch = async function (search: string) {
    //         const newSearch: searchResult[] = await searchSongs(search);
    //         setSearchList(newSearch);
    //         setActiveSelection(-1);
    //     }
    //     performSearch(searchText);
    // }, [searchText]);

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
                </div>
            </div>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col">
                    {
                        searchList.map((key, i) => {
                            return <SongCard key={i} songName={key["title"]} index={i} isActive={activeSelection == i} tagList={key.tags} onClick={() => {onClickCompound(i,true)}} />
                        })
                    }
                    <Modal isOpen ={isOpen} onClose={() =>setIsOpen(false)} songData={metaData}></Modal>
                </div>
                {/* <div className="col">
                    <MusicCard id={metaData["id"]} title={metaData["title"]} date={metaData["date"]} description={metaData["description"]} tags={metaData["tags"]} maestro={metaData["maestro"]} performers={metaData["performers"]} />
                </div> */}
            </div>
            <div className="row">
                <br />
            </div>
        </div>
    );
}

export default ConcertPage;




// Tag queue based search backup. No longer exposing specific tags to user.



// const [tagList, setTagList] = useState<Tag[]>([]);
// const [tagQueue, setTagQueue] = useState<Tag[]>([]);

// const dequeue = function (tagL: Tag[], tagQ: Tag[]): Tag[] {
//     if (tagQ.length > 0) {
//         let dequeue = tagQ.shift()
//         if (dequeue != undefined) {
//             let newArr = [...tagL];
//             newArr[tagL.indexOf(dequeue)].active = false;
//             setTagList(newArr);
//             // setData(newArr);
//             // tagList[tagL.indexOf(dequeue)].active = false;
//             // dequeue.active = false;
//             return tagQ;
//         }
//     }

//     return tagQ;
// }

// const enqueue = function (tagL: Tag[], tagQ: Tag[], tag: Tag): Tag[] {
//     console.log(tag);

//     if (tagQ.length < 3) {
//         tag.active = true;
//         console.log(tag);
//         tagQ.push(tag);
//         return tagQ;
//     }
//     else {
//         dequeue(tagL, tagQ);
//         enqueue(tagL, tagQ, tag);
//         return tagQ;
//     }

//     return tagQ;
// }

// const tagQueueHandler = function (tagL: Tag[], tagQ: Tag[], tag: Tag) {
//     console.log("TAGQUEUE")
//     setTagQueue(enqueue(tagL, tagQ, tag));
// }

// // Get tags useEffect hook
// useEffect(() => {
//     const refreshTags = async function () {
//         const newTags: Tag[] = await getTags();
//         setTagList(newTags);
//     }
//     refreshTags();
// }, []);

// // Tag list useeffect hook.
// useEffect(() => {
//     console.log("CHANGING TAGLIST", tagList);
// }, [tagList]);

// const tagHandler = function (tags: Tag[]) {
//     console.log(tags);
//     setTagList(tags);
// }