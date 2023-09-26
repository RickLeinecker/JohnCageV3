import console_log from '../logging/console_log';
import {Request, Response} from 'express';
import {Tags} from '../models/Tags';
import {Recordings} from '../models/Recordings';

class RecordingsController {
    async getRecordings(req: Request, res: Response) {
        const recordings = await Recordings.findAll();
        res.status(200).send(recordings);
    }
}

export default RecordingsController;