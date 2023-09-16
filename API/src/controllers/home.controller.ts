import { Request, Response } from "express";
import Recording from "../models/recording.model";
import recordingRepository from "../repositories/recording.repository";
var ms = require('mediaserver');

export default class HomeController {
  async welcome(req: Request, res: Response) {
    return res.json({ message: "Welcome to JCT application." });
  }

  async listenToRecording(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const recording = await recordingRepository.retrieveById(id);

      if (recording) {
                // Create a filepath for the song.
                const controllerFolder = __dirname + "/";
                const musicFolder = "Music" + "/";
                const Title = recording?.dataValues.Title;
                const fileType = ".mp3";

                const recordingLoc = controllerFolder + musicFolder + Title + fileType;
                ms.pipe(req, res, recordingLoc);
      }
      else
        res.status(404).send({
          message: `Cannot find Recording with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Recording with id=${id}.`
      });
    }
  }

    async search(req: Request, res: Response) {
      const Title = typeof req.query.Title === "string" ? req.query.Title : "";
      console.log(Title);

      try {
        const recordings = await recordingRepository.retrieveAll({ Title });
        res.status(200).send(recordings);

      } catch (err) {
        res.status(500).send({
          message: "Some error occurred while retrieving recordings."
        });
      }
  }
}