import { buildPath } from "../Variables/expressServer";

const getNextConcert = async function () {
    try {
        // Get song metadata based on unique song id
        const URL = buildPath('/schedules/getNextConcert');
        console.log("Fetch request URL: ", URL);
        const response = await fetch(URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const res = JSON.parse(await response.text());
        const sd = JSON.parse(JSON.stringify(res));
        const concertData = sd.nextConcertGroup;

        const tags = typeof concertData["Tags"] == "string" ? concertData["Tags"].split("`") : [];

        // Save metadata to concertData type
        let nextConcertData = {
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

        let nextConcertData = {
            GroupLeaderName: "",
            Title: "No future concert found.",
            Tags: "",
            Description: "Schedule your own today!",
            Date: "",
            Time: "",
        };
        console.log("Error next concert data: ", nextConcertData);
        return nextConcertData;
    }
};

export default getNextConcert;