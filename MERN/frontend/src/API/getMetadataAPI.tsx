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
        const currentSongData = sd.group;

        let performers: string[] = [];
        performers.push(currentSongData["User1Name"]);
        performers.push(currentSongData["User2Name"]);
        performers.push(currentSongData["User3Name"]);
        performers.push(currentSongData["User4Name"]);
        performers.push(currentSongData["GroupLeaderName"]);

        // Save metadata to concertData type
        var newMetaData: concertData = {
            id: currentSongData["GroupID"],
            title: currentSongData["Title"],
            date: currentSongData["Date"],
            description: currentSongData["Description"],
            tags: currentSongData["Tags"] != null ? currentSongData["Tags"] : [],
            maestro: currentSongData["GroupLeaderName"],
            performers: performers
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
            tags: "",
            maestro: "",
            performers: []
        };
        console.log("Error Metadata: ", emptyMetaData);
        return emptyMetaData;
    }
};

export default getMetadata;