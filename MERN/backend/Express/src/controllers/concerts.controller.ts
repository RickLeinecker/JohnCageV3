// Libraries
const ms = require('mediaserver');
const { Op } = require("sequelize");
import { Request, Response } from "express";

// Functions
import console_log from "../../../functions/logging/console_log";
import { getDateUTC, getTimeUTC, formatDateTime, validDate } from "../../../functions/date.functions";

// Models
import { recordings, groups } from "../models/init-models";

// Config
import { MUSIC_FOLDER } from "../../config/express.config";

interface concertsAPI {
  findAndPipeAudio(req: Request, res: Response): Promise<void>;
  findAllGroups(req: Request, res: Response): Promise<void>;
  filterConcertsByDateRange(req: Request, res: Response): Promise<void>;
  findOne(req: Request, res: Response): Promise<void>;
  searchConcerts(req: Request, res: Response): Promise<void>;
}

class ConcertsController implements concertsAPI {
  // IMPORTNAT: THIS CURRENTLY USES THE GROUP ID TO SEARCH. IDEALLY WE USE THE PK FROM THE TABLE. IT SHOULD STILL WORK.
  async findAndPipeAudio(req: Request, res: Response) {
    let groupId: number = parseInt(req.query.id as string);
    if (!groupId) {
      groupId = -1;
    }

    await recordings.findOne({
      where: { GroupID: groupId }
    }).then((recording) => {
      if (!recording) { throw new Error("Recording not found."); }

      const fileName = recording.RecordingFileName;
      const recordingFilePath = MUSIC_FOLDER + fileName;

      ms.pipe(req, res, recordingFilePath);
    }).catch((e) => {
      console_log("Error: ", e.message, "\n");
      res.status(500).json({ error: e.message });
    });
  }

  // @route /api/concerts/groups
  // @desc  returns a list of all the groups
  async findAllGroups(req: Request, res: Response) {
    const allGroups: groups[] = await groups.findAll({ attributes: ['DateCreated'] });
    console.log("All groups:", JSON.stringify(allGroups, null, 2));

    res.status(200).json({
      groups: allGroups
    });
  }

  // Todo: Filter by date range
  async filterConcertsByDateRange(req: Request, res: Response) {
    // Todo: Get start date from request
    // const startDate = new Date(req.query.startDate as string);
    // console.log(startDate);

    // // Todo: Get end date from request
    // const endDate = new Date(req.query.endDate as string);
    // console.log(endDate);

    // {
    //   "startDate": "2023-09-29T03:43:28.000Z",
    //   "endDate": "2023-10-04T03:46:27.000Z"
    // }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    // console.log(startDate);
    // console.log(endDate);

    // let toTimestamp = (startDate: string) => {
    //   (startDate);
    // }

    // toTimestamp(req.body.startDate);

    Date.parse(req.body.startDate);
    console.log(req.body.startDate);
    console.log(Date.parse(req.body.startDate));
    const groupsInDateRange = await groups.findAll({
      where: {
        DateCreated: {
          $lt: new Date(),
          $gt: Date.parse(req.body.startDate)
        }
      }
      // DateCreated < [timestamp] AND DateCreated > [timestamp]

      //     // where: {
      //     //   Date: {
      //     //     from: {
      //     //       $between: [startDate, endDate]
      //     //     }
      //     //   }
      //     // }
    });
    console.log("All groups in date range:", JSON.stringify(groupsInDateRange, null, 2));
  }

  async findOne(req: Request, res: Response) {
    let groupId: number = parseInt(req.query.id as string);
    if (!groupId) {
      groupId = -1;
    }

    await groups.findOne({
      attributes: ['GroupID', 'GroupLeaderName', 'User1Name', 'User2Name', 'User3Name', 'User4Name',
        'GroupName', 'Title', 'Tags', 'Description', 'Date'],
      where: {
        GroupID: groupId
      }
    }).then((group) => {
      if (!group) { throw new Error("Group not found.") }

      res.status(200).json({ group });
    }).catch((e) => {
      console_log("Error: ", e.message, "\n");
      res.status(500).send({ error: e.message });
    });

    // const recording = await recordings.findOne({
    //   where: {
    //     ID: recordingId
    //   },
    // }).then((recording) => {
    //   // Check if there is a group.
    //   if (!recording) {
    //     return res.status(400).json({ results: "No Results. Try another Recording ID" });
    //   };

    //   const group = groups.findOne({
    //     attributes: ['GroupID', 'GroupLeaderName', 'User1Name', 'User2Name', 'User3Name', 'User4Name',
    //       'GroupName', 'Title', 'Tags', 'Description', 'Date'],
    //     where: {
    //       GroupID: recording?.GroupID
    //     }
    //   }).then((group) => {
    //     // Check if there is a group.
    //     if (!group) {
    //       return res.status(400).json({ results: "No Results. Try another GroupID" });
    //     }

    //     // response contains the group that is mapped to this specific recording via the GroupID.
    //     res.status(200).json({
    //       group
    //     });

    //   }).catch((err) => {
    //     res.status(500).send({
    //       message: "Some error occurred while retrieving a group."
    //     });
    //   });
    // });
  }

  async searchConcerts(req: Request, res: Response) {
    // Store and validate input.
    const pageLength = 8;
    const searchString = typeof req.query.search === "string" ? req.query.search : "";
    const fromDateTime = validDate(req.query.fromDateTime as string) ? formatDateTime(Date.parse(req.query.fromDateTime as string)) : "2000-01-01T00:00:00";
    const toDateTime = validDate(req.query.toDateTime as string) ? formatDateTime(Date.parse(req.query.toDateTime as string)) : "9999-12-31T23:59:59";
    let page: number = parseInt(req.query.page as string) >= 0 ? parseInt(req.query.page as string) : 0;

    const fromDate: string = fromDateTime.split('T').at(0) as string;
    const fromTime: string = fromDateTime.split('T').at(1) as string;
    const toDate: string = toDateTime.split('T').at(0) as string;
    const toTime: string = toDateTime.split('T').at(1) as string;

    console_log(fromDate, fromTime, toDate, toTime);

    const currentDate: string = getDateUTC();
    const currentTime: string = getTimeUTC();

    // Search
    await groups.findAll({
      limit: pageLength,
      offset: pageLength * page,
      attributes: ['GroupID', 'GroupLeaderName', 'Title', 'Tags', 'Date', 'Time'],
      where: {
        [Op.and]: [
          // Find search string
          {
            [Op.or]: [
              { Title: { [Op.like]: `%${searchString}%` } },
              { Tags: { [Op.like]: `%${searchString}%` } }
            ]
          },
          // Ignore future groups
          {
            [Op.or]: [
              { Date: { [Op.lt]: currentDate } },
              { Date: { [Op.eq]: currentDate }, Time: { [Op.lte]: currentTime } },
              { Date: { [Op.eq]: null }, Time: { [Op.eq]: null } }
            ]
          },
          // // Find date and time
          {
            [Op.or]: [
              {
                [Op.and]: [
                  { Date: { [Op.eq]: fromDate } },
                  { Date: { [Op.eq]: toDate } },
                  { Time: { [Op.between]: [fromTime, toTime] } }
                ]
              },
              {
                [Op.and]: [
                  { Date: { [Op.eq]: fromDate } },
                  { Date: { [Op.lt]: toDate } },
                  { Time: { [Op.gte]: fromTime } }
                ]
              },
              {
                [Op.and]: [
                  { Date: { [Op.gt]: fromDate } },
                  { Date: { [Op.eq]: toDate } },
                  { Time: { [Op.lte]: toTime } }
                ]
              },
              {
                [Op.and]: [
                  { Date: { [Op.gt]: fromDate } },
                  { Date: { [Op.lt]: toDate } }
                ]
              }
            ]
          }
        ]
      }
    }).then((groups) => {
      res.status(200).send({ searchResults: groups });
    }).catch((e) => {
      console_log("Error: ", e.message, "\n");
      res.status(500).send({ error: e.message });
    });
  }
}

export default ConcertsController;
