//    To verify a registration action, we need one function
//    check if username or email or phone is duplicate or not

import { NextFunction, Request, Response } from "express";

// User Model
import { users } from "../models/init-models";

const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
  // Parse the request body for the UserName and Email fields.
  let { UserName, Email, Phone } = req.body;

  try {
    // Username
    let user = await users.findOne({
      where: {
        UserName: UserName // Format needs to match as follows - [DatabaseField: RequestBodyField]
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }

    // Email
    user = await users.findOne({
      where: {
        Email: Email // Format needs to match as follows - [DatabaseField: RequestBodyField]
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    // Phone
    // user = await users.findOne({
    //   where: {
    //     Phone: Phone // Format needs to match as follows - [DatabaseField: RequestBodyField]
    //   }
    // });

    // if (user) {
    //   return res.status(400).send({
    //     message: "Failed! Phone number is already in use!"
    //   });
    // }

    //next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Username!",
      error: error
    });
  }
};

// Export the function (checkDuplicateUsernameOrEmail) to make it callable in our "user.routes" file.
export const verifyRegister = {
  checkDuplicateUsernameOrEmail,
};

