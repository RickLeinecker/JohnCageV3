import { tags, tagsAttributes } from "../models/tags";
import console_log from "../logging/console_log";

interface ITagRepository {
    retrieveAll(): Promise<tagsAttributes[]>;
}

class TagRepository implements ITagRepository {

    async save(tag: tags): Promise<tags> {
        try {
            return await tags.create({
                idTags: tag.idTags,
                Tag: tag.Tag
            });
        } catch (err) {
            throw new Error("Failed to create Tag!");
        }
    }

    async retrieveAll(): Promise<tagsAttributes[]> {
        var tagList: tagsAttributes[] = [];

        try {
            // Get response
            const query = await tags.findAll();

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