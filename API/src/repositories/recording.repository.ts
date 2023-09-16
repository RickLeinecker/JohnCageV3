import { Op } from "sequelize";
import Recording from "../models/recording.model";

interface IRecordingRepository {
  save(recording: Recording): Promise<Recording>;
  retrieveAll(searchParams: {Title: string}): Promise<Recording[]>;
  retrieveById(recordingId: number): Promise<Recording | null>;
  update(recording: Recording): Promise<number>;
  delete(recordingId: number): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class RecordingRepository implements IRecordingRepository {
  async save(recording: Recording): Promise<Recording> {
    try {
        return await Recording.create({
          Title: recording.Title,
          GroupID: recording.GroupID,
          Tag1: recording.Tag1,
          Tag2: recording.Tag2,
          Tag3: recording.Tag3,
        });
      } catch (err) {
        throw new Error("Failed to create Recording!");
      }
  }

  async retrieveAll(searchParams: {Title?: string, Tag1?: string, Tag2?: string, Tag3?: string}): Promise<Recording[]> {
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
    
        return await Recording.findAll({ where: condition});
      } catch (error) {
        throw new Error("Failed to retrieve Recording!");
      }
  }

  async retrieveById(recordingId: number): Promise<Recording | null> {
    try {
        return await Recording.findByPk(recordingId);
      } catch (error) {
        throw new Error("Failed to retrieve Recording!");
      }
  }

  async update(recording: Recording): Promise<number> {
    const { id, Title, GroupID, Tag1, Tag2, Tag3 } = recording;

    try {
      const affectedRows = await Recording.update(
        { Title, GroupID, Tag1, Tag2, Tag3 },
        { where: { id: id } }
      );
  
      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Recording!");
    }
  }

  async delete(recordingId: number): Promise<number> {
    try {
        const affectedRows = await Recording.destroy({ where: { id: recordingId } });
    
        return affectedRows;
      } catch (error) {
        throw new Error("Failed to delete Recording!");
      }
  }
}

export default new RecordingRepository();