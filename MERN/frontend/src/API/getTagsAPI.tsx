import tagList from "../Types/tagList";
import { buildPath } from "../Variables/expressServer";

const getTags = async function () {
    try {
        const response = await fetch(buildPath('/concerts/getTags'), { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        console.log("Fetch request URL: ", buildPath('/concerts/getTags'));

        var res = JSON.parse(await response.text());
        var sd = JSON.parse(JSON.stringify(res));
        const tags = sd.tags;
        console.log("Tag Results: ", tags);

        var newTags: string[] = [];
        var activeList: boolean[] = [];
        for (var i = 0; i < tags.length && i < 10; ++i) {
            newTags.push(tags[i]);
            activeList.push(false);
        }

        const final: tagList = { tags: newTags, activeList: activeList }
        return final;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
        const final: tagList = { tags: [], activeList: [] }
        return final;
    }
};

export default getTags;