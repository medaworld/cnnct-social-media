import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';

import { isAuthenticated } from '../middleware/isAuthenticated';
import { login, register, logout } from '../controllers/users';
import passport from 'passport';

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject('Email address already exists!');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  register
);

router.post('/login', passport.authenticate('local'), login);

router.get('/logout', logout);

export default router;
