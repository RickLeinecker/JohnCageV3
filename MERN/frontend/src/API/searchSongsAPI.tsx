import searchResult from "../Types/searchResult";
import { buildPath } from "../Variables/expressServer";

const searchSongs = async function (searchText: string, page: number) {
    try {
        //Get recording metadata according to search text
        const URL = buildPath('/concerts/searchSongs?search=' + searchText + "&page=" + page);
        console.log("Fetch request URL: ", URL);
        const response = await fetch(URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const res = JSON.parse(await response.text());
        const sd = JSON.parse(JSON.stringify(res));
        const searchResults = sd.searchResults;

        //Save metadata to "result" interface array
        var search: searchResult[] = [];
        for (let i = 0; i < searchResults.length && i < 10; ++i) {
            search.push({
                id: searchResults[i].GroupID,
                title: searchResults[i].Title,
                tags: searchResults[i].Tags,
                maestro: searchResults[i].GroupLeaderName
            });
        }

        console.log("Search Results: ", search);
        return search;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
        var searchEmpty: searchResult[] = [
            {
                title: "An error occured during your search.",
                id: -1,
                tags: "",
                maestro: ""
            }
        ];
        console.log("Error Search Results: ", searchEmpty);
        return searchEmpty;
    }
};

export default searchSongs;