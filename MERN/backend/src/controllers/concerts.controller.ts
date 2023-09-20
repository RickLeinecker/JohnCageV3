import { Request, Response } from "express";
import Recording from "../models/recording.model";
import recordingRepository from "../repositories/recording.repository";
var ms = require('mediaserver');

class ConcertsController {

  async pipeConcertFile(req: Request, res: Response) {

    var concertId: number = parseInt(req.query.id as string);
    if (!concertId) {
      concertId = 0;
    }

    if (concertId == 1) {
      ms.pipe(req, res, './music/bass.mp3');
    }
    else if (concertId > 1) {
      ms.pipe(req, res, './music/alarm.mp3');
    }
    else {
      res.status(200);
    }

    /*
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

  async retrieveConcertData(req: Request, res: Response) {
    const dummyResponse =
    {
      id: 1,
      maestro: "Paul",
      performers: ["Kyle", "Paul", "Stephen", "Rayyan", "Himil"],
      title: "Concert One",
      tags: ["Slow", "Quiet", "Loud"],
      description: "High intensity pipe action yahoo.",
      date: "2023-September-11-6-00-PM"
    }
    const dummyResponse2 =
    {
      id: 2,
      maestro: "Mario",
      performers: ["Kyle", "Paul", "Stephen", "Rayyan", "Himil"],
      title: "Concert Two",
      tags: ["Slow", "Quiet", "Loud"],
      description: "Super Mario Game.",
      date: "Today"
    }
    const defaultResponse =
    {
      id: -1,
      maestro: "",
      performers: [],
      title: "",
      tags: [],
      description: "",
      date: ""
    }

    var concertId: number = parseInt(req.query.id as string);
    if (!concertId) {
      concertId = 0;
    }

    if (concertId == 1) {
      res.status(200).send({ songData: dummyResponse });
    }
    else if (concertId > 1) {
      res.status(200).send({ songData: dummyResponse2 });
    }
    else {
      res.status(200).send({ songData: defaultResponse })
    }

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

  async searchConcerts(req: Request, res: Response) {
    const dummyResponse = [
      {
        id: 1,
        maestro: "Paul",
        title: "Concert: One",
        tags: ["Slow", "Quiet", "Loud"]
      },
      {
        id: 2,
        maestro: "Paul",
        title: "Concert: Two",
        tags: ["Fast", "Hard"]
      }
    ];

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

  async retrieveRandomTags(req: Request, res: Response) {
    const dummyResponse =
      [
        "Fast",
        "Slow"
      ];
      
    res.status(200).send({ tags: dummyResponse });

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