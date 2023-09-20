import { buildPath } from "../Variables/expressServer";
import concertData from "../Types/concertData";

const getMetadata = async function (id: number) {
    try {
        const response = await fetch(buildPath('/concerts/getSongData?id=' + id), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        console.log("Fetch request URL: ", buildPath('/concerts/getSongData?id=' + id));

        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const currentSongData = sd.songData;

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
        console.log("Metadata: ", emptyMetaData);
        return emptyMetaData;
    }
};

export default getMetadata;