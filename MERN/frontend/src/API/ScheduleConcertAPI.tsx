import { buildPath } from "../Variables/expressServer";

const ScheduleConcert = async function name(values:any, date:string, maestroID:number) {
    try {
        const JSONObj = JSON.stringify({ 
            "maestroId": maestroID, 
            "maestroName": "IAmMaestro", 
            "concertTitle": values.eventName, 
            "concertTags": ["Stronger", "Faster"], 
            "concertDescription": "Example Description.", 
            "date": date, 
            "time": values.eventTime
        });
        console.log("Successfully created a JSON of schedule " + JSONObj);
        const URL = buildPath("/schedules/schedule");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL, { method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' }, body: JSONObj })
        const JSONText = JSON.parse(await response.text());
        console.log(JSONText);
        return JSONText;
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
    }
};

export default ScheduleConcert;