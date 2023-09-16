import { Request, Response } from "express";
import Recording from "../models/recording.model";
import recordingRepository from "../repositories/recording.repository";
var ms = require('mediaserver');

class ConcertsController {

  async listenToRecording(req: Request, res: Response) {

    ms.pipe(req, res, './music/bass.mp3');

    /*
    var concertId: number = parseInt(req.query.id as string);
    if (!concertId) {
      concertId = 0;
    }

    try {
      const recording = await recordingRepository.retrieveById(concertId);

      if (recording) {
        const controllerFolder = __dirname + "/";
        const musicFolder = "music" + "/";
        const Title = recording?.dataValues.Title;
        const fileType = ".mp3";

        const recordingLoc = controllerFolder + musicFolder + Title + fileType;
        ms.pipe(req, res, recordingLoc);
      }
      else
        res.status(404).send({
          message: `Cannot find Recording with id=${concertId}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Recording with id=${concertId}.`
      });
    }
    */
  }

  async search(req: Request, res: Response) {
    const dummyResponse = [{ Title: "Concert One", ID: 1 }, { Title: "Concert Two", ID: 2 }];
    res.status(200).send({ searchResults: dummyResponse });

    /*
      const Title = typeof req.query.Title === "string" ? req.query.Title : "";
  
      try {
        const recordings = await recordingRepository.retrieveAll({ Title });
        res.status(200).send(recordings);
  
      } catch (err) {
        res.status(500).send({
          message: "Some error occurred while retrieving recordings."
        });
      }
       */
  }
}

export default ConcertsController;


// Backups
// // var id: number = parseInt(req.params.id);