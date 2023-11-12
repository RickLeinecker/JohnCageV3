import { buildPath } from "../Variables/expressServer";
import nextConcertData from "../Types/nextConcertData";

const getNextConcert = async function () {
    try {
        // Get the scheduled concert closest to the present.
        const URL = buildPath('/schedules/getNextConcert');
        console.log("Fetch request URL: ", URL);
        const response = await fetch(URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const res = JSON.parse(await response.text());
        const sd = JSON.parse(JSON.stringify(res));
        const concertData = sd.nextConcertGroup;

        const tags = typeof concertData["Tags"] == "string" ? concertData["Tags"].split("`") : [];

        let nextConcertData:nextConcertData = {
            GroupLeaderName: concertData["GroupID"],
            Title: concertData["Title"],
            Tags: tags,
            Description: concertData["Description"],
            Date: concertData["Date"],
            Time: concertData["Time"],
        };

        console.log("Next concert data: ", nextConcertData);
        return nextConcertData;
    }
    catch (e) {
        if (e instanceof Error) { console.error(e.toString()); }
        else { console.error(e); }

        let nextConcertData:nextConcertData = {
            GroupLeaderName: "",
            Title: "No future concert found.",
            Tags: [],
            Description: "Schedule your own today!",
            Date: "",
            Time: "",
        };
        console.log("Error next concert data: ", nextConcertData);
        return nextConcertData;
    }
};

export default getNextConcert;