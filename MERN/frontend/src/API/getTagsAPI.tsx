// NOT IN USE CURRENTLY
import tag from "../Types/tag";
import { buildPath } from "../Variables/expressServer";

const getTags = async function (): Promise<tag[]> {

    try {
        const URL = buildPath('/concerts/getTags');
        console.log("Fetch request URL: ", URL);
        const response = await fetch(URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const tags = sd.tags;

        //console.log("Tag Results: ", tags);
        var newTags: tag[] = [];
        for (var i = 0; i < tags.length && i < 10; ++i) {
            newTags.push({ id: tags[i].idTags, tag: tags[i].Tag, active: false })
        }

        console.log("New tags", newTags);
        return newTags;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }

        var defaultTags: tag[] = [];
        console.log("New default tags", defaultTags)
        return defaultTags;
    }
};

export default getTags;