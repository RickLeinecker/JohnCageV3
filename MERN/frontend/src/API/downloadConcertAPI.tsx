import { buildPath } from "../Variables/expressServer";
import download from "downloadjs";

const downloadConcert = async function (groupId: number, desiredName: string): Promise<void> {
    try {
        // Download song based on the group's ID.
        const URL = buildPath('/concerts/downloadConcertFile?id=' + groupId);
        console.log("Fetch request URL: ", URL);
        const res = await fetch(URL);
        const blob = await res.blob();
        download(blob, desiredName);
        return;
    }
    catch (e) {
        if (e instanceof Error) { console.error(e.toString()); }
        else { console.error(e); }

        return;
    }
};

export default downloadConcert;