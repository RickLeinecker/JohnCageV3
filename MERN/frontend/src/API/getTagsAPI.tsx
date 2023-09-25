import Tag from "../Types/Tag";
import { buildPath } from "../Variables/expressServer";

const getTags = async function () {


    try {
        var newTags: Tag[] = [];

        const response = await fetch(buildPath('/concerts/getTags'), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        console.log("Fetch request URL: ", buildPath('/concerts/getTags'));

        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const tags = sd.tags;
        //console.log("Tag Results: ", tags);

        for (var i = 0; i < tags.length && i < 10; ++i) {
            newTags.push({ id: tags[i].idTags, tag: tags[i].Tags, active: false })
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

        var defaultTags: Tag[] = [];
        console.log("New default tags", defaultTags)
        return defaultTags;
    }
};

export default getTags;