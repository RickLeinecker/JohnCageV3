import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logging from '../../config/logging';
import config from '../../config/config';

const NAMESPACE = 'AUTH';

const extractJWT = async (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Validating token');

  let token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, config.server.token.secret, (error, decoded) => {
      if (error) {
        return res.status(404).json({
          message: 'Invalid token',
        });
      } else {
        res.locals.jwt = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export default extractJWT;
