import console_log from '../logging/console_log';
import {Request, Response} from 'express';
import {Tags} from '../models/Tags';

class TagsController {
    async getTags(req: Request, res: Response) {
        const tags = await Tags.findAll();
        res.status(200).send(tags);
    }
}

export default TagsController;