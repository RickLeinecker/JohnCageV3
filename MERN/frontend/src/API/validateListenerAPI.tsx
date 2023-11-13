import { buildPath } from "../Variables/expressServer";

const validateListener = async function name(listenerPasscode: string) {
    try {
        const JSONObj = JSON.stringify({ "listenerPasscode": listenerPasscode });
        console.log("Successfully created a JSON for validate listener: " + JSONObj);
        const URL = buildPath("/schedules/validateListener");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL, { method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' }, body: JSONObj })
        const JSONText = JSON.parse(await response.text());
        const sd = JSON.parse(JSON.stringify(JSONText));
        if (sd.error) { console.log("Validation failed."); return false; }

        console.log("Validation succeeded.");
        return true;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }

        console.log("Validation failed.");
        return false;
    }
};

export default validateListener;