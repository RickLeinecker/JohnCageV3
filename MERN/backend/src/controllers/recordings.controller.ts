import console_log from '../logging/console_log';
import {Request, Response} from 'express';
import {Tags} from '../models/Tags';
import { Groups } from '../models/init-models';
import { Users } from '../models/init-models';
import {Recordings} from '../models/init-models';
import recordingsRepository from '../repositories/recordings.repository';

class RecordingsController {
    async getRecordings(req: Request, res: Response) {
        const recordings = await Recordings.findAll();
        res.status(200).send(recordings);
    }

    async getRecordingsGroups(req: Request, res: Response) {
        const group = req.params.group;
        const recordings = await Recordings.findAll({
            where: {"GroupID": group}, include: ['Group'] });
        res.status(200).send(recordings);
    }

    async search(req: Request, res: Response) {
        const Title = typeof req.query.Title === "string" ? req.query.Title : "";
        
        const Tag1 = typeof req.query.Tag1 === "string" ? req.query.Tag1 : "";
        const Tag2 = typeof req.query.Tag2 === "string" ? req.query.Tag2 : "";
        const Tag3 = typeof req.query.Tag3 === "string" ? req.query.Tag3 : "";
    
        try {
            const recordings = await recordingsRepository.retrieveAll({ Title, Tag1, Tag2, Tag3 });
            res.status(200).send(recordings);
    
        } catch (err) {
          res.status(500).send({
            message: "Some error occurred while retrieving recordings."
          });
        }
      }

    async getRecordingsUsers(req: Request, res: Response) {
        const recordings = await Recordings.findAll({
            attributes: ['ID', 'Title', 'FilePath', 'Tag1', 'Tag2', 'Tag3', 'FileName', 'Description', 'Date'],
            include: [{
                model: Groups,
                as: 'Group',
                attributes: ['GroupID', 'GroupName'],
                include: [{
                    model: Users,
                    as: 'GroupLeader',
                    attributes: ['ID', 'UserName'],
                }, {
                    model: Users,
                    as: 'User1',
                    attributes: ['ID', 'UserName'],
                }, {
                    model: Users,
                    as: 'User2',
                    attributes: ['ID', 'UserName'],
                }, {
                    model: Users,
                    as: 'User3',
                    attributes: ['ID', 'UserName'],
                }, {
                    model: Users,
                    as: 'User4',
                    attributes: ['ID', 'UserName'],
                }]
            }]
        
        });
            
        res.status(200).send(recordings);
    }
}

export default RecordingsController;