import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import passport from 'passport';
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
    const { firstName, lastName, email, password, birthday } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      birthday: new Date(birthday),
    });
    const registeredUser = await User.register(user, password);
    if (registeredUser) {
      res
        .status(201)
        .json({ message: 'User Created!', userId: registeredUser._id });
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

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }

    if (req.session) {
      req.session.destroy((error) => {
        if (error) {
          return next(error);
        }
        res.clearCookie('session');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
};
