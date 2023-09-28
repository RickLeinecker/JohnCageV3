// import console_log from '../logging/console_log';
// import {Request, Response} from 'express';
// import {Tags} from '../models/Tags';
// import { Groups } from '../models/init-models';
// import { Users } from '../models/Users';
// import {Recordings} from '../moxdels/Recordings';

// class RecordingsController {
//     async getRecordings(req: Request, res: Response) {
//         const recordings = await Recordings.findAll();
//         res.status(200).send(recordings);
//     }

//     async getRecordingsGroups(req: Request, res: Response) {
//         const group = req.params.group;xwxwxw
//         const recordings = await Recordings.findAll({
//             where: {"GroupID": group}, include: ['Group'] });
//         res.status(200).send(recordings);
//     }
// }

// export default RecordingsController;