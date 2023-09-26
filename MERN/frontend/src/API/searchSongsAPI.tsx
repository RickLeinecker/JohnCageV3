import searchResult from "../Types/searchResult";
import { buildPath } from "../Variables/expressServer";


const searchSongs = async function (searchText: string) {
    try {
        //Get recording metadata according to search text
        const response = await fetch(buildPath('/concerts/searchSongs?search=' + searchText), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        console.log("Fetch request URL: ", buildPath('/concerts/searchSongs?search=' + searchText));
        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const searchResults = sd.searchResults;

        //Save metadata to "result" interface array
        var searchTemp: searchResult[] = [];
        for (var i = 0; i < searchResults.length && i < 10; ++i) {
            searchTemp.push(
                {
                    title: searchResults[i].title,
                    id: searchResults[i].id,
                    tags: searchResults[i].tags,
                    maestro: searchResults[i].maestro,
                }
            );
        }

        console.log("Search Results: ", searchTemp);
        return searchTemp;
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
                title: "",
                id: -1,
                tags: [],
                maestro: ""
            }
        ];
        console.log("Search Results: ", searchEmpty);
        return searchEmpty;
    }
};

export default searchSongs;