import { NextFunction, Request, Response } from "express";
import { Users, UsersAttributes, UsersCreationAttributes } from "../models/Users";
import userRepository from "../repositories/user.repository";
import bcryptjs from 'bcryptjs';
import logging from "../config/logging";
import signJWT from "../functions/functions.signJWT";
// import IUser from "../interfaces/interface.user";

const NAMESPACE = "User";

export default class UserController {
  async validateToken(req: Request, res: Response, next: NextFunction) {
    logging.info(NAMESPACE, "Token validated, user authorized");
  
    return res.status(200).json({
      message: "Authorized"
    });
  };

  async register(req: Request, res: Response, next: NextFunction) {
    let { Email, UserName, Phone, Password } = req.body;

    if (!Phone) {
      res.status(400).send({
        message: "Phone number required!"
      });
      return;
    }

    if (!Email) {
      res.status(400).send({
        message: "Email can not be empty!"
      });
      return;
    }

    if (!UserName)
    {
      res.status(400).send({
        message: "UserName can not be empty!"
      });
      return; 
    }
    
    if (!Password)
    {
      res.status(400).send({
        message: "Password can not be empty!"
      });
      return;
    }

    Users
    .findOne({
      where: {
        UserName: req.body.UserName
      }
    })
    .then(user => {
        if (user) {
          res
          .status(400)
          .send(
            { message: "Failed! Username is already in use!" }
          );
          return;
        }

        // Check if there is an Email that already exists.
        Users
        .findOne({
          where: {
            Email: req.body.Email
          }
        })
        .then(user => {
          if (user) {
            res
            .status(400)
            .send(
              { message: "Failed! Email is already in use!" }
            );
            return;
          }
          next();
        });
    }).catch((error) => {
      console.log(res.status(400).send("Failed to sign up"));
      return;
    });

  
    bcryptjs.hash(Password, 10, (hashError, hash) => {
      if (hashError)
      {
        return res.status(500).json({
          message: hashError.message,
          error: hashError
        });
      }

      console.log("HASH " + hash);

  
      // TODO: Insert user into DB here.
      try {
        // let { FirstName, LastName, Email, Password, Phone, UserName } = req.body;
        let user: Users = req.body;

        user.Password = hash;

        const savedUser = userRepository.save(user);
  
        res.status(201).send(savedUser);
      } catch (err) {
        res.status(500).send({
          message: "Some error occurred while creating user."
        });
        return;
      }
    });
  };

  async login(req: Request, res: Response, next: NextFunction) {
    let { username, password } = req.body;
    await Users.findAll({
      where: {
        UserName: username
      }
    }).then((users) => {
      bcryptjs.compare(password, users[0].Password, (error, result) => {
        if (error)
        {
          return res.status(401).json({
            message: error.message,
            error
          });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error)
            {
              return res.status(401).json({
                message: "Unable to Sign JWT",
                error: _error
              });
            }
            else if(token)
            {
              return res.status(200).json({
                message: "Auth Successful",
                token,
                user: users[0]
              });
            }
          });
        }
      });
    });
  };

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Returns the Id and Username attributes of the user only.
      const users = await userRepository.retrieveAll();

      res.status(200).json({
        users,
        count: users.length
      });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users."
      });
    }
  };

  async create(req: Request, res: Response) {

  }

  // async findAll(req: Request, res: Response) {
  //   const userName = typeof req.query.UserName === "string" ? req.query.UserName : "";

  //   try {
  //     const users = await userRepository.retrieveAll({ userName });

  //     res.status(200).send(users);
  //   } catch (err) {
  //     res.status(500).send({
  //       message: "Some error occurred while retrieving users."
  //     });
  //   }
  // }

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
    let user: Users = req.body;
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
        message: `Error updating User with id=${user.ID}.`
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

//   async findAllVerified(req: Request, res: Response) {
//     try {
//       const users = await userRepository.retrieveAll({ IsVerified: true });

//       res.status(200).send(users);
//     } catch (err) {
//       res.status(500).send({
//         message: "Some error occurred while retrieving verified users."
//       });
//     }
//   }

//   async findAllAdmins(req: Request, res: Response) {
//     try {
//       const users = await userRepository.retrieveAll({ IsAdmin: true });

//       res.status(200).send(users);
//     } catch (err) {
//       res.status(500).send({
//         message: "Some error occurred while retrieving admins."
//       });
//     }
//   }
}