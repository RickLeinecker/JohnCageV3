import { Tags, TagsAttributes } from "../models/Tags";
import console_log from "../logging/console_log";

interface ITagRepository {
    retrieveAll(): Promise<TagsAttributes[]>;
}

class TagRepository implements ITagRepository {

    async save(tag: Tags): Promise<Tags> {
        try {
            return await Tags.create({
                idTags: tag.idTags,
                Tags: tag.Tags
            });
        } catch (err) {
            throw new Error("Failed to create Tag!");
        }
    }

    async retrieveAll(): Promise<TagsAttributes[]> {
        var tagList: TagsAttributes[] = [];

        try {
            // Get response
            const query = await Tags.findAll();

            // Translate to basic object
            for (let i = 0; i < query.length; ++i) {
                tagList.push(query[i].dataValues);
            }

            // Return result
            return tagList;
        } catch (error) {
            // This error catch doesn't seem to work. 
            // findAll().then().catch() works, but causes problems returning for me.
            console.log(error);
        }

        // Default
        return tagList;
    }
}

export default new TagRepository();