import { Op } from "sequelize";
import {Recordings} from "../models/init-models";
import {Groups} from "../models/init-models";
import {Users} from "../models/init-models";

interface IRecordingsRepository {
    //save(recording: Recordings): Promise<Recordings>;
    retrieveAll(searchParams: {Title: string}): Promise<Recordings[]>;
    //retrieveById(recordingId: number): Promise<Recordings | null>;
    //update(recording: Recordings): Promise<number>;
    //delete(recordingId: number): Promise<number>;
  }
  
  interface SearchCondition {
    [key: string]: any;
  }

  class RecordingsRepository implements IRecordingsRepository {

    async retrieveAll(searchParams: {Title?: string, Tag1?: string, Tag2?: string, Tag3?: string}): Promise<Recordings[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.Title)
            condition.title = { [Op.like]: `%${searchParams.Title}%` };

            if(searchParams?.Tag1)
            condition.tag1 = { [Op.like]: `%${searchParams.Tag1}%` };

            if(searchParams?.Tag2)
            condition.tag2 = { [Op.like]: `%${searchParams.Tag2}%` };

            if(searchParams?.Tag3)
            condition.tag3 = { [Op.like]: `%${searchParams.Tag3}%` };
    
            return await Recordings.findAll({ where: condition,
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
                    }]}]
                });
        } catch (error) {
            throw new Error("Failed to retrieve Recording!");
        }
    }
}

export default new RecordingsRepository();