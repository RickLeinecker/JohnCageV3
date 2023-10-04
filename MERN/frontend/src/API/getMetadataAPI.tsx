import { buildPath } from "../Variables/expressServer";
import concertData from "../Types/concertData";

const getMetadata = async function (id: number) {
    try {
        // Get song metadata based on unique song id
        const URL = buildPath('/concerts/getSongData?id=' + id);
        console.log("Fetch request URL: ", URL);
        const response = await fetch(URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const currentSongData = sd.songData;

        // Save metadata to concertData type
        var newMetaData: concertData = {
            id: currentSongData["id"],
            title: currentSongData["title"],
            date: currentSongData["date"],
            description: currentSongData["description"],
            tags: currentSongData["tags"],
            maestro: currentSongData["maestro"],
            performers: currentSongData["performers"]
        };

        console.log("Metadata: ", newMetaData);
        return newMetaData;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }

        var emptyMetaData: concertData = {
            id: 0,
            title: "",
            date: "",
            description: "",
            tags: [],
            maestro: "",
            performers: []
        };
        console.log("Error Metadata: ", emptyMetaData);
        return emptyMetaData;
    }
};

export default getMetadata;