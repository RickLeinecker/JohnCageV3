import { NextFunction, Request, Response } from 'express';
import { users } from '../models/init-models';

// To verify a registration action
const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Parse the request body for the UserName
  const requestedUsername = req.body.UserName;

  // Parse the request body for the Email
  const requestedEmail = req.body.Email;

  // Check if the request body contains an email or username that matches a users email/username from the database
  try {
    // Select from 'users' where 'Username = requestedUsername'
    let user = await users.findOne({
      where: {
        UserName: requestedUsername, // Format needs to match as follows - [DatabaseField: RequestBodyField]
      },
    });

    if (user) {
      return res.status(400).send({
        message: 'Failed! Username is already in use!',
      });
    }

    // Select from 'users' where 'Email' = 'requestedEmail'
    user = await users.findOne({
      where: {
        Email: requestedEmail, // Format needs to match as follows - [DatabaseField: RequestBodyField]
      },
    });

    if (user) {
      return res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
    }

    // Required for the program to move on from this middleware.
    next();
  } catch (error) {
    return res.status(500).send({
      message: 'User Registration failed!',
    });
  }
};

export default checkDuplicateUsernameOrEmail;
