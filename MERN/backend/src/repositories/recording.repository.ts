import { Op } from "sequelize";
import { recordings } from "../models/recordings";

interface IRecordingRepository {
  //save(recording: recordings): Promise<recordings>;
  retrieveAll(searchParams: { Title: string }): Promise<recordings[]>;
  retrieveById(recordingId: number): Promise<recordings | null>;
  //update(recording: recordings): Promise<number>;
  delete(recordingId: number): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class RecordingRepository implements IRecordingRepository {
  // async save(recording: recordings): Promise<recordings> {
  //   // try {
  //   //     return await recordings.create({
  //   //       Title: recording.Title,
  //   //       FilePath: recording.FilePath,
  //   //       GroupID: recording.GroupID,
  //   //       Tag1: recording.Tag1,
  //   //       Tag2: recording.Tag2,
  //   //       Tag3: recording.Tag3,
  //   //       PicturePath: recording.PicturePath,
  //   //       FileName: recording.FileName,
  //   //       Description: recording.Description,
  //   //       Date: recording.Date
  //   //     }, {fields: ['Title', 'Tag1', 'Tag2', 'Tag3', 'Description']}); // Restrict the user model to set only these fields.
  //   //   } catch (err) {
  //   //     throw new Error("Failed to create Recording!");
  //   //   }
  // }

  async retrieveAll(searchParams: { Title?: string, Tag1?: string, Tag2?: string, Tag3?: string }): Promise<recordings[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.Title)
        condition.title = { [Op.like]: `%${searchParams.Title}%` };

      if (searchParams?.Tag1)
        condition.tag1 = { [Op.like]: `%${searchParams.Tag1}%` };

      if (searchParams?.Tag2)
        condition.tag2 = { [Op.like]: `%${searchParams.Tag2}%` };

      if (searchParams?.Tag3)
        condition.tag3 = { [Op.like]: `%${searchParams.Tag3}%` };

      return await recordings.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Recording!");
    }
  }

  async retrieveById(recordingId: number): Promise<recordings | null> {
    try {
      return await recordings.findByPk(recordingId);
    } catch (error) {
      throw new Error("Failed to retrieve Recording!");
    }
  }

  // async update(recording: recordings): Promise<number> {
  //   const { ID, Title, GroupID, Tag1, Tag2, Tag3 } = recording;

  //   try {
  //     const affectedRows = await recordings.update(
  //       { Title, GroupID, Tag1, Tag2, Tag3 },
  //       { where: { ID: ID } }
  //     );

  //     return affectedRows[0];
  //   } catch (error) {
  //     throw new Error("Failed to update Recording!");
  //   }
  // }

  async delete(recordingId: number): Promise<number> {
    try {
      const affectedRows = await recordings.destroy({ where: { ID: recordingId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Recording!");
    }
  }
}

export default new RecordingRepository();