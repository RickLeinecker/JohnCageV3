import { Request, Response } from "express";
import tagRepository from "../repositories/tag.repository";
import recordingRepository from "../repositories/recording.repository";
import console_log from "../logging/console_log";
import { tags, tagsAttributes, recordings, groups} from "../models/init-models";
var ms = require('mediaserver');
const { Op } = require("sequelize");

class ConcertsController {
  async findAndPipeAudio(req: Request, res: Response) {
    // Todo: Add ability to query a recording by id and return the actual audio.
    const recordingId: number = parseInt(req.query.id as string);
    const recording = await recordings.findOne({
        where: {
            ID: recordingId
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
      res.status(401).json({ success: false, message: err});
  });
}

  async findOne(req: Request, res: Response) {
    const recordingId: number = parseInt(req.query.id as string);
    const recording = await recordings.findOne({
      where: {
          ID: recordingId
      },
    }).then((recording) => {
      // Check if there is a group.
      if (!recording) {
        return res.status(400).json({ results: "No Results. Try another Recording ID" });
      };

      // Print this recordings info.
      console.log(recording?.ID);
      console.log(recording?.GroupID);
      console.log(recording?.RecordingFileName);

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
    const searchString = typeof req.query.search === "string" ? req.query.search : "";

    // Find all groups based on the 'search' filter.
    const allTheGroups = await groups.findAll({
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

    res.status(200).send({ searchResults: allTheGroups });
  }

  async retrieveRandomTags(req: Request, res: Response) {
    let response: tagsAttributes[] = [];

    try {
      response = await tagRepository.retrieveAll();
    } catch (err) {
      res.status(500).send({ message: "Some error occurred while retrieving tags." });
    }

    console.log(response);
    res.status(200).send({ tags: response });
  }
}

export default ConcertsController;
