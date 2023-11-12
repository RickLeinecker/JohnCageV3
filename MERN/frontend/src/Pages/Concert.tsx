// Style
import "../Style/App.css";
import "../Style/button.css";
import "../Style/search.css";

// Components
import { Component, useEffect, useState } from "react";
import MusicCard from "../Components/MusicCard";
import { Form, Button } from "react-bootstrap";
import Modal from "../Components/Modal";

// API functions
import getMetadata from "../API/getMetadataAPI";
import searchSongs from "../API/searchSongsAPI";
import getNextConcert from "../API/getNextConcertAPI";

// Types
import concertData from "../Types/concertData";
import searchResult from "../Types/searchResult";
import nextConcertData from "../Types/nextConcertData";

// Just there
import React from "react";


//Interfaces/objects
type ButtonState = {
    songName: string;
    songTags: string;
    index: number;
    isActive: boolean;
    onClick: Function;
}

var Results: searchResult[] = [{
    id: 0,
    title: "Test",
    tags: "Pie Cookies",
    maestro: "Kyle"
},
{
    id: 1,
    title: "Example",
    tags: "Pie Cookies",
    maestro: "Kyle"
},
{
    id: 2,
    title: "Example but better",
    tags: "Pie Cake",
    maestro: "Kyle"
},
{
    id: 3,
    title: "Daniel",
    tags: "Bakery Memes",
    maestro: "Kyle"
}
];

var testNextConcert:nextConcertData = {
    GroupLeaderName: "Kyle the Crocodyle",
    Title: "Atlas",
    Tags: [""],
    Description: "Skibididi",
    Date: "01-01-1999",
    Time: "03:04:00",
};

type nextConcertModalData = {
    nextConcert:nextConcertData,
    onClick:Function
}

function TagsString(tags: string): string {

    if (tags.length < 1)
        return "";
    let tagsSplit:string[] = tags.split("`");
    let tagString:string = tagsSplit[0];
    for(let i = 1; i < tagsSplit.length; i++)
    {
        tagString += ","+tagsSplit[i];
    }


    return tagString;

}


class SongCard extends Component<ButtonState>
{
    handleClick = () => this.props.onClick(this.props.index)

    render() {
        return (
            <button className="songButton" onClick={this.handleClick}>
                <div className="searchCard">
                    <div className="card-body">
                        <h5 className="card-title" style={{ textAlign: "center", fontSize: "1rem" }}>
                            {this.props.songName}
                        </h5>
                        <br />
                        <p className="card-text" style={{ textAlign: "center", fontSize: "0.75rem", overflowWrap:"break-word" }}>
                            {TagsString(this.props.songTags)}
                        </p>
                    </div>
                    <br />
                </div>
            </button>
        )
    }
}

function NextSongCard(nextConcert:nextConcertModalData)
{
    if (nextConcert.nextConcert.GroupLeaderName === "")
    {
        return(
            <div>

            </div>
        )
    }
    else
    {
        return(
            <button className="songButton" onClick={nextConcert.onClick(true)}>
                <div className="searchCard">
                    <div className="card-body">
                        <h3 className="card-title" style={{ textAlign: "center", fontSize: "2rem" }}>
                            {nextConcert.nextConcert.Title}
                        </h3>
                        <br />
                        <h5 className="card-text">{nextConcert.nextConcert.GroupLeaderName}</h5>
                        <p className="card-text" style={{ textAlign: "center", fontSize: "0.75rem", overflowWrap:"break-word" }}>
                            
                        </p>
                    </div>
                    <br />
                </div>
            </button>
        )
    }
}
//Functions
function ConcertPage() {
    const [searchText, setSearchText] = useState<string>('');
    const [searchList, setSearchList] = useState<Array<searchResult>>([{ title: "default", id: -1, tags: "", maestro: "", }]);
    const [activeSelection, setActiveSelection] = useState<number>(-1);
    const [metaData, setMetaData] = useState<concertData>({ id: -1, title: "", date: "", description: "", tags: "", maestro: "", performers: [""] });
    const [page, setPage] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);
    const [nextConcertData, setNextConcertData] = useState<nextConcertData>(testNextConcert);

    // Pagination
    const nextPage = function () {
        if (searchList.length > 0) {
            setPage(page + 1);
        }
    }
    const prevPage = function () {
        if (page > 0) {
            setPage(page - 1);
        }
    }

    function onClickCompound(index: number, open: boolean) {
        setActiveSelection(index);
        setIsOpen(open);
    }

    // Search Text useEffect hook
    useEffect(() => {
        const performSearch = async function (search: string, page: number) {
            const newSearch: searchResult[] = await searchSongs(search, page);
            setSearchList(newSearch);
            setActiveSelection(-1);
        }
        performSearch(searchText, page);
    }, [searchText, page]);


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

    useEffect(() => {
        const getNextConcertData = async function()
        {
            let concertData:nextConcertData = await getNextConcert();
            setNextConcertData(concertData);
        }
    },[nextConcertData])

    return (
        <div className="container">
            <div className ="row">
            <NextSongCard nextConcert={nextConcertData} onClick={setIsOpen}/>
            </div>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col">
                    <Form.Group>
                        <Form.Control type='searchtext' value={searchText} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)} placeholder="Search past concerts by tag or title" />
                    </Form.Group>
                </div>
            </div>
            <div className="row">
                <br />
            </div>
            <div className="row">
                <div className="col-4">
                    <Button onClick={prevPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                            <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </Button>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <p>Page: {page + 1}</p>
                </div>
                <div className="col-4" style={{ textAlign: "right" }}>
                    <Button onClick={nextPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                            <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </Button>
                </div>
                <br />
                <br />
                </div>
            <div className="row">
                <div className="col">

                    <div className="d-grid" role="group" aria-label="Toolbar with button groups">
                        <div className="row">
                            {
                                searchList.map((key, i) => {
                                    return (
                                        <div className="col-3 track-col">
                                            <SongCard key={i} songName={key["title"]} index={i} isActive={activeSelection == i} songTags={key.tags} onClick={() => { onClickCompound(i, true) }} />
                                            <br />
                                            <br />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} songData={metaData}></Modal>
                    </div>

                </div >

            </div >
            <div className="row">
                <br />
            </div>
        </div >
    );
}

export default ConcertPage;



/*
 <div className="col">
                    <MusicCard id={metaData["id"]} title={metaData["title"]} date={metaData["date"]} description={metaData["description"]} tags={metaData["tags"]} maestro={metaData["maestro"]} performers={metaData["performers"]} />
                </div>
*/



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