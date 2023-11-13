import { buildPath } from "../Variables/expressServer";
import scheduleArgs from '../Types/scheduleArgs';

const exampleInput = {
    title: "Example Input",
    tags: ["Example Tags", "Example Tag"],
    description: "Example Description",
    date: "2023-10-20",
    time: "20:00:00",
    identifier: "Try",
    password: "1111"
};

const exampleRequest = JSON.stringify({
    concertTitle: "Example Request",
    concertTags: ["Example Tags", "Example Tag"],
    concertDescription: "Example Description",
    date: "2023-10-20",
    time: "20:00:00",
    username: "Try",
    password: "1111"
});

const schedule = async function (scheduleArgs: scheduleArgs | undefined) {
    try {
        let body = exampleRequest;
        if (scheduleArgs) {
            const requestBody = JSON.stringify({
                concertTitle: scheduleArgs.title,
                concertTags: scheduleArgs.tags,
                concertDescription: scheduleArgs.description,
                date: scheduleArgs.date,
                time: scheduleArgs.time,
                username: scheduleArgs.identifier,
                password: scheduleArgs.password
            });

            body = requestBody;
        }

        const URL = buildPath('/schedules/schedule');
        console.log("Request URL: ", URL);
        const response = await fetch(URL, { method: 'Post', body: body, headers: { 'Content-Type': 'application/json' } });
        const res = JSON.parse(await response.text());
        const sd = JSON.parse(JSON.stringify(res));
        console.log(sd);
        if (sd.error) {
            console.log("Error: ", sd.error);
            return;
        }

        let group = sd.group;
        let schedule = sd.schedule;
        console.log(group, schedule);

        return schedule;
    }
    catch (e) {
        if (e instanceof Error) { console.error(e.toString()); }
        else { console.error(e); }

        return;
    }
};

export default schedule;