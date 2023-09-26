import { Tag, TagObject } from "../models/tag.model";
import console_log from "../logging/console_log";

interface ITagRepository {
    retrieveAll(): Promise<TagObject[]>;
}

class TagRepository implements ITagRepository {

    async save(tag: Tag): Promise<Tag> {
        try {
            return await Tag.create({
                idTags: tag.idTags,
                Tags: tag.Tags
            });
        } catch (err) {
            throw new Error("Failed to create Tag!");
        }
    }

    async retrieveAll(): Promise<TagObject[]> {
        var tagList: TagObject[] = [];

        try {
            /*
            // Get response
            const query = await Tag.findAll();

            // Translate to basic object
            for (let i = 0; i < query.length; ++i) {
                tagList.push(query[i].dataValues);
            }
            */


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