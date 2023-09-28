import { Request, Response } from "express";
import { Recordings } from "../models/Recordings";
import { Groups } from '../models/init-models';
import recordingRepository from "../repositories/recording.repository";

export default class RecordingController {
  async create(req: Request, res: Response) {
    if (!req.body.Title) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const recording: Recordings = req.body;
      const savedRecording = await recordingRepository.save(recording);
      res.status(201).send(savedRecording);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving recordings."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const Title = typeof req.query.Title === "string" ? req.query.Title : "";

    try {
      const recordings = await recordingRepository.retrieveAll({ Title });
      res.status(200).send(recordings);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving recordings."
      });
    }
  }

  async getRecordingsGroups(req: Request, res: Response) {
    const group = req.params.group;
    try {
      const recordings = await Recordings.findAll({
        where: {"GroupID": group}, include: ['Group']
      });
      res.status(200).send(recordings);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving recordings."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const recording = await recordingRepository.retrieveById(id);

      if (recording) res.status(200).send(recording);
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

  async update(req: Request, res: Response) {
    let recording: Recordings = req.body;
    recording.ID = parseInt(req.params.id);

    try {
      const num = await recordingRepository.update(recording);

      if (num == 1) {
        res.send({
          message: "Recording was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Recording with id=${recording.ID}. Maybe Recording was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Recording with id=${recording.ID}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await recordingRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Recording deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Recording with id=${id}. Maybe Recording was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Recording with id==${id}.`
      });
    }
  }

    async search(req: Request, res: Response) {
      const Title = typeof req.query.Title === "string" ? req.query.Title : "";
      
      const Tag1 = typeof req.query.Tag1 === "string" ? req.query.Tag1 : "";
      const Tag2 = typeof req.query.Tag2 === "string" ? req.query.Tag2 : "";
      const Tag3 = typeof req.query.Tag3 === "string" ? req.query.Tag3 : "";

      try {
        const recordings = await recordingRepository.retrieveAll({ Title, Tag1, Tag2, Tag3 });
        res.status(200).send(recordings);

      } catch (err) {
        res.status(500).send({
          message: "Some error occurred while retrieving recordings."
        });
      }
    }
}