import { Request, Response } from "express";
import User from "../models/user.model";
import userRepository from "../repositories/user.repository";

export default class UserController {
  async create(req: Request, res: Response) {
    if (!req.body.Email) {
      res.status(400).send({
        message: "Email can not be empty!"
      });
      return;
    }

    if (!req.body.UserName) {
      res.status(400).send({
        message: "UserName can not be empty!"
      });
      return;
    }

    if (!req.body.Password) {
      res.status(400).send({
        message: "Password can not be empty!"
      });
      return;
    }


    try {
      const user: User = req.body;
      if (!user.IsAdmin) user.IsAdmin = false;
      if (!user.IsVerified) user.IsVerified = false;

      const savedUser = await userRepository.save(user);

      res.status(201).send(savedUser);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating users."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const UserName = typeof req.query.UserName === "string" ? req.query.UserName : "";

    try {
      const users = await userRepository.retrieveAll({ UserName });

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const user = await userRepository.retrieveById(id);

      if (user) res.status(200).send(user);
      else
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving User with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let user: User = req.body;
    user.ID = parseInt(req.params.id);

    try {
      const num = await userRepository.update(user);

      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${user.ID}. Maybe User was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating User with id=${user.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await userRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete User with id==${id}.`
      });
    }
  }

  async findAllVerified(req: Request, res: Response) {
    try {
      const users = await userRepository.retrieveAll({ IsVerified: true });

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving verified users."
      });
    }
  }

  async findAllAdmins(req: Request, res: Response) {
    try {
      const users = await userRepository.retrieveAll({ IsAdmin: true });

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving admins."
      });
    }
  }
}