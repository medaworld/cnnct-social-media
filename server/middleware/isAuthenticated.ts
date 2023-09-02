import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const jwtSecret: string = process.env.JWT_SECRET!;

export default function (req: any, res: Response, next: NextFunction) {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, jwtSecret);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.id;
  req.isAuth = true;
  next();
}
