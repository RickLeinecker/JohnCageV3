import { Request, Response } from "express";
import console_log from "../logging/console_log";
import tagRepository from "../repositories/tag.repository";
import { tagsAttributes, recordings, groups } from "../models/init-models";
var ms = require('mediaserver');
const { Op } = require("sequelize");
var fs = require("fs");

interface concertsAPI {
  findAndPipeAudio(req: Request, res: Response): Promise<void>;
  findAllGroups(req: Request, res: Response): Promise<void>;
  filterConcertsByDateRange(req: Request, res: Response): Promise<void>;
  findOne(req: Request, res: Response): Promise<void>;
  searchConcerts(req: Request, res: Response): Promise<void>;
}

class ConcertsController implements concertsAPI {
  async findAndPipeAudio(req: Request, res: Response) {
    // Todo: Add ability to query a recording by id and return the actual audio.
    let recordingId: number = parseInt(req.query.id as string);
    if (!recordingId) {
      recordingId = -1;
    }

    const recording = await recordings.findOne({
      where: {
        ID: recordingId // PRetty sure this should be changed to the groupID FK.
      }
    }).then((recording) => {
      // Check if there is a recording.
      if (!recording) {
        return res.status(400).json({ results: "No Results. Try another recordingID" });
      }

      const filePath = './music/';
      const fileName = recording.RecordingFileName;
      const recordingFilePath = filePath + fileName;

      ms.pipe(req, res, recordingFilePath);
    }).catch((err) => {
      res.status(401).json({ success: false, message: err });
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
    let recordingId: number = parseInt(req.query.id as string);
    if (!recordingId) {
      recordingId = -1;
    }

    const recording = await recordings.findOne({
      where: {
        ID: recordingId
      },
    }).then((recording) => {
      // Check if there is a group.
      if (!recording) {
        return res.status(400).json({ results: "No Results. Try another Recording ID" });
      };

      const group = groups.findOne({
        attributes: ['GroupID', 'GroupLeaderName', 'User1Name', 'User2Name', 'User3Name', 'User4Name',
          'GroupName', 'Title', 'Tags', 'Description', 'Date'],
        where: {
          GroupID: recording?.GroupID
        }
      }).then((group) => {
        // Check if there is a group.
        if (!group) {
          return res.status(400).json({ results: "No Results. Try another GroupID" });
        }

        // response contains the group that is mapped to this specific recording via the GroupID.
        res.status(200).json({
          group
        });

      }).catch((err) => {
        res.status(500).send({
          message: "Some error occurred while retrieving a group."
        });
      });
    });
  }

  async searchConcerts(req: Request, res: Response) {
    const pageLength = 8;
    const searchString = typeof req.query.search === "string" ? req.query.search : "";
    let page: number = parseInt(req.query.page as string);
    if (!page) {
      page = 0;
    }

    // Find all groups based on the 'search' filter.
    const allTheGroups = await groups.findAll({
      limit: pageLength,
      offset: pageLength * page,
      attributes: ['GroupID', 'GroupLeaderName', 'Title', 'Tags'],
      where: {
        [Op.or]:
          [
            {
              // Find any song title that has 'search' as a substring.
              Title: {
                [Op.like]: `%${searchString}%`
              }
            },
            {
              // Find any song with tags that have 'search' string query as a substring.
              Tags: {
                [Op.like]: `%${searchString}%`
              }
            }
          ]
      }
    });

    //console.log(allTheGroups);

    res.status(200).send({ searchResults: allTheGroups });
  }
}

export default ConcertsController;
