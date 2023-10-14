import { NextFunction, Request, Response } from "express";
import { users } from "../models/init-models";
import userRepository from "../repositories/user.repository";
import bcryptjs from 'bcryptjs';
import logging from "../config/logging";
import signJWT from "../functions/functions.signJWT";
const { Op } = require("sequelize");
import console_log from "../logging/console_log";

const NAMESPACE = "User";

export default class UserController {
  async validateToken(req: Request, res: Response, next: NextFunction) {
    logging.info(NAMESPACE, "Token validated, user authorized");

    return res.status(200).json({
      message: "User is Authorized"
    });
  };

  // For creating a new user and storing them in the database.
  async register(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    let { Name, UserName, Email, Password, Phone } = req.body;

    console.log(Password);

    if (!Password) {
      return res.status(400).send({
        message: "Password invalid!"
      });
    }

    try {
      // Hash the password
      bcryptjs.hash(Password, 10, async (hashError, hash) => {
        if (hashError) {
          return res.status(500).json({
            message: hashError.message,
            error: hashError
          });
        }

        // Create a new user
        const newUser = await users.create({
          // Required fields
          Name: Name,
          UserName: UserName,
          Email: Email,
          Password: hash,

          // Optional field(s)
          Phone: Phone
        },
          // Define which attributes can be set based on a form (restrict the User model to set only these fields)
          { fields: ['Name', 'UserName', 'Email', 'Password', 'Phone'] })
          .catch((error) => {console.log("Erory Message: ",error) });

        if (newUser) {
          // Return the (registered) user as response.
          return res.status(201).json({
            message: "User registered successfully!",
            user: newUser
          });
        }

        return res.status(500).json({
          message: "Failed"
        });
      });
    } catch (err) {
      return res.status(500).send({
        message: "Some error occurred while creating a new user."
      });
    };
  }; // Register

  // To login the user and return token & user object
  async login(req: Request, res: Response, next: NextFunction) {
    // Parse the body of the request for the required fields to log in.
    let { username, password } = req.body;

    try {
      // A query to select from 'users' where 'UserName' is equal to the username parsed from the request body.
      // const allUsers = 
      await users.findAll({
        attributes: { exclude: ['VerificationCode'] },
        where: {
          UserName: {
            [Op.eq]: username
          }
        }
      }).then((allUsers) => {
        console_log("Login query successful: ");
        console_log(allUsers);

        // Verify that the allUsers has type 'users' when retrieved
        // console.log(allUsers.every(allUsers => allUsers instanceof users)); // true

        // Log all the users (that the 'allUsers' variable is pointing to) that were retrieved.
        // console.log("All users:", allUsers, null, 2);

        bcryptjs.compare(password, allUsers[0].Password, (error, result) => {

          console_log("Login password comparison begun: ");

          if (error) {
            console_log("Login password comparison error: ");
            console_log(error);
            return res.status(401).json({
              message: error.message
            });
          }
          else if (result) {
            console_log("Login password comparison passed.");

            signJWT(allUsers[0], (_error, token) => {
              if (_error) {
                return res.status(401).json({
                  message: "Unable to Sign JWT",
                  error: _error
                });
              }
              else if (token) {
                console_log("JWT signed. Login successful.");
                console_log("\n");
                return res.status(200).json({
                  message: "Authorization Successful.",
                  token: token,
                  user: allUsers[0]
                });
              }
            });
          }
        });
      });
    }
    catch (err) {
      console_log("Login Error: ");
      console_log(err);
      console_log("\n");
      return res.status(500).send({
        message: "Some error occurred while logging in a user."
      });
    }
  };

  // Select all the 'users' in the database.
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Only want to select the 'ID' and 'UserName' using the attributes option.
      let allTheUsers: users[] = await users.findAll({
        attributes: ['ID', 'UserName']
      });

      res.status(200).json({
        // Pass
        allTheUsers,

        // Pass the number of users found to frontend.
        count: allTheUsers.length
      });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users."
      });
    }
  };

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
    let user: users = req.body;
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