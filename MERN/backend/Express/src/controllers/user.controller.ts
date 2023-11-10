import { NextFunction, Request, Response } from "express";
import { users, usersAttributes } from "../models/init-models";
import usersRepository from "../repositories/users.repository";
import bcryptjs, { hash } from 'bcryptjs';
import logging from "../../config/logging";
import signJWT from "../functions.signJWT";
const { Op } = require("sequelize");
import console_log from "../../../functions/logging/console_log";
import crypto from 'crypto';
import { sendEmail } from "../functions/sendEmail";

const NAMESPACE = "User";

class UserController {
  async validateToken(req: Request, res: Response, next: NextFunction) {
    logging.info(NAMESPACE, "Token validated, user authorized");

    return res.status(200).json({
      message: "User is Authorized"
    });
  };

  // For creating a new user and storing them in the database.
  async register(req: Request, res: Response, next: NextFunction) {
    let { UserName, Email, Password } = req.body;
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
        const user = await users.create(
          {
            UserName: UserName,
            Email: Email,
            Password: hash,
          },
          { fields: ['UserName', 'Email', 'Password'] })
          .then((user) => {
            if (!user) { throw new Error("Failed to create user.") }

            // Create a token for this users email verification.
            const verifyEmailToken = Math.floor(100000 + Math.random() * 900000);

            // Store the random code/string in the database with a reference to the User ID.
            user.VerificationCode = verifyEmailToken;

            // the verification code is still "null" in the database
            user.save();
            // Now the verification code was updated to "temp_verifyEmailToken" in the database!


            const protocol = req.protocol; // e.g. 'http'
            const host = req.get('host'); // e.g. 'localhost:5003'
            const route = "/api/users/verify-email/";

            const ref = `${protocol}://${host}${route}${verifyEmailToken}`;
            var linkText = "Visit JohnCageTribute.org!"

            // Set the options for the email.
            var mailOptions = {
              email: user.Email,
              subject: "Please verify your email",
              html: "<h1>Welcome to JohnCageTribute!</h1><p>Please verify your email address by clicking below:</p>" + `<p><a href=${ref}>${linkText}</a></p>`
            }

            // Send email to the supplied email address with the hash as part of a link pointing back to a route on the server.
            sendEmail(mailOptions);

            // Return the (registered) user as response.
            return res.status(201).json({
              message: "User registered successfully!",
              user: user
            });
          })
          .catch((e) => {
            console_log("Error: ", e, "\n");
            return res.status(500).send({
              error: e.message
            });
          });
      });
    } catch (err) {
      return res.status(500).send({
        message: "Some error occurred while creating a new user."
      });
    };
  }; // Register

  // @desc    The route that the email provided a link for to verify user email address
  // @route   GET /api/users/verify-email/:token
  // @access  Public
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    // If the hash exists in the database, get the related user and set their 'isVerified' to true
    const user = users.findOne({
      where: {
        VerificationCode: req.params.token
      }
    }).then((user) => {
      if (!user) {
        console.log("No user with that code");
        return;
      }

      // The user is now verified
      user.IsVerified = 1;

      // Delete (set to -1) the hash from the database
      user.VerificationCode = -1;

      user.save();

      return res.status(201).json({
        success: true,
        data: user
      });
    }).catch((error) => {
      return res.status(500).send({
        error: error.message
      });
    });
  }

  // @desc    Forgot password
  // @route   POST /api/users/forgot-password
  // @access  Public
  async forgotPassword(req: Request, res: Response) {
    // Get the email address from the user who wants to reset password
    const emailAddress = req.body.email;

    // Check if the email provided in the JSON request body exists in the table of users.
    const user = users.findOne({
      where: {
        Email: emailAddress
      }
    }).then((user) => {
      // Handle the case: No email in 'users' table matches the email address given in the JSON request body.
      if (!user) {
        return res.status(500).send({
          success: false,
          data: "No user with that email exists"
        });
      }

      // Generate a new 'random' password for this user.
      const new_password = crypto.randomBytes(10).toString('hex');

      // Hash 'new password' using bcryptjs library and save in users 'Password' field in database.
      bcryptjs.hash(new_password, 10, async (hashError, hash) => {
        if (hashError) {
          return res.status(500).json({
            message: hashError.message,
            error: hashError
          });
        }

        // Set and Save a hashed version of the new password to the users 'Password' field in the database.
        user.Password = hash;
        user.save();

        // Send the new password to the users email address
        var mailOptions = {
          email: user.Email,
          subject: 'Reset Password',
          html: `<h1>Use the password below to login to your account</h1><p>${new_password}</p>`
        }

        // Use 'nodemailer' library to send an email with the specified mail options.
        sendEmail(mailOptions);
      });
      // // Respond with the token that is hashed.
      return res.status(201).json({
        success: true,
        data: user
      });
    }).catch((error) => {
      return res.status(500).send({
        success: false,
        error: error.message
      });
    })
  }

  // To login the user and return token & user object
  async login(req: Request, res: Response, next: NextFunction) {
    let { identifier, password } = req.body;

    // A query to select from 'users' where 'UserName' is equal to the username parsed from the request body.
    await users.findAll({
      where: {
        UserName: { [Op.eq]: identifier },
      }
    }).then((allUsers) => {
      console_log("Login query successful: ");

      try {
        bcryptjs.compare(password, allUsers[0].Password, (error, result) => {

          console_log("Login password comparison begun: ");

          if (error) {
            console_log("Login password comparison error: ");
            console_log(error);
            return res.status(401).json({ message: error.message });
          }
          else if (!result) {
            console_log("Login password comparison not passed.");
            return res.status(401).json({ message: "Invalid Password." });
          }

          console_log("Login password comparison passed.");

          signJWT(allUsers[0], (_error, token) => {
            if (_error) {
              return res.status(401).json({
                message: "Unable to Sign JWT",
                error: _error
              });
            }
            else if (token) {
              console_log("JWT signed. Login successful.\n");
              console_log("\n");
              return res.status(200).json({
                message: "Authorization Successful.",
                token: token,
                user: allUsers[0]
              });
            }
          });
        });
      }
      catch (e: any) {
        console_log("Error: ", e.message, "\n");
        return res.status(401).json({ message: e.message });
      }
    }).catch((e) => {
      console_log("Error: ", e.message, "\n");
      return res.status(401).json({ message: e.message });
    });
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
      const user = await usersRepository.retrieveById(id);

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
      const num = await usersRepository.update(user);

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
      const num = await usersRepository.delete(id);

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
  //       const users = await usersRepository.retrieveAll({ IsVerified: true });

  //       res.status(200).send(users);
  //     } catch (err) {
  //       res.status(500).send({
  //         message: "Some error occurred while retrieving verified users."
  //       });
  //     }
  //   }

  //   async findAllAdmins(req: Request, res: Response) {
  //     try {
  //       const users = await usersRepository.retrieveAll({ IsAdmin: true });

  //       res.status(200).send(users);
  //     } catch (err) {
  //       res.status(500).send({
  //         message: "Some error occurred while retrieving admins."
  //       });
  //     }
  //   }
}

export default UserController;