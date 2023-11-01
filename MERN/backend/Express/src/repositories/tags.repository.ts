import { tags, tagsAttributes } from "../models/init-models";
import console_log from "../../../functions/logging/console_log";

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
        let tagList: tagsAttributes[] = [];

        try {
            const query = await tags.findAll();
            for (let i = 0; i < query.length; ++i) {
                tagList.push(query[i].dataValues);
            }
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