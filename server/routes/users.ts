import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import { login, register, logout } from '../controllers/users';
import passport from 'passport';

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty()
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ username: value });
        if (userDoc) {
          return Promise.reject('Username already exists!');
        }
      }),
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject('Email address already exists!');
        }
      }),
    body('password').trim().isLength({ min: 3 }),
  ],
  register
);

router.post('/login', passport.authenticate('local'), login);

router.get('/logout', logout);

export default router;
