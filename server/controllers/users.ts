import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.JWT_SECRET!;

class CustomError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user, password);
    if (registeredUser) {
      const token = jwt.sign({ id: registeredUser._id }, jwtSecret, {
        expiresIn: '1h',
      });
      res
        .status(201)
        .json({ token, message: 'User Created!', userId: registeredUser._id });
      console.log('User created');
    }
  } catch (e) {
    if (e instanceof CustomError && !e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const user: any = req.user;
      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: '1h',
      });
      res
        .status(200)
        .json({ token, message: 'User logged in!', userId: user._id });
      console.log('User logged in');
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (e) {
    if (e instanceof CustomError && !e.statusCode) {
      e.statusCode = 401;
    }
    next(e);
  }
};
