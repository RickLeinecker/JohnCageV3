import jwt from "jsonwebtoken";
import config from "../config/config";
import logging from '../config/logging';
import { users } from "./models/init-models";

const NAMESPACE = "Auth";

// Called when the user logs in to create the token and return it.
const signJWT = (user: users, callback: (error: Error | null, token: string | null) => void): void => {
    // Returns time in milliseconds.
    var timeSinceEpoch = new Date().getTime();

    // Number in config file is in minutes, so multiply it by 100,000 to convert the time to milliseconds.
    var expirationTime = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;

    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    logging.info(NAMESPACE, `Attempting to sign token for ${user.UserName}`);

    try {
        jwt.sign(
            // Payload
            {
                username: user.UserName
            },
            // Configuration settings from config file
            config.server.token.secret,
            {
                // Specific (options) for our JsonWebToken
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            },
            // Callback function
            (error, token) => {
                if (error) {
                    // Pass in our callback a token that equals null because the token is invalid.
                    callback(error, null);
                } else if (token) {
                    // Error equals null because token is valid
                    callback(null, token);
                }
            }
        );
    } catch (error: any) {
        // Throw a logging message to print the error.
        logging.error(NAMESPACE, error.message, error);

        // Attach callback, pass in an error into the callback, and set token equal to null.
        callback(error, null);
    }
};

export default signJWT;