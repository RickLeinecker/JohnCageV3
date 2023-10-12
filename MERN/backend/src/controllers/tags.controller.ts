import console_log from '../logging/console_log';
import { Request, Response } from 'express';
import { tags } from '../models/init-models';

class TagsController {
    async getTags(req: Request, res: Response) {
        const tagsResponse = await tags.findAll();
        res.status(200).send(tagsResponse);
    }
}

export default TagsController;