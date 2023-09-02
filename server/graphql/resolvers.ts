import { Request } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Post from '../models/Post';
import { validateUserInput } from '../utils/validatorUtils';

const jwtSecret: string = process.env.JWT_SECRET!;
export default {
  createUser: async function ({ userInput }: { userInput: any }) {
    validateUserInput(userInput);

    const existingUser = await User.findOne({
      $or: [{ username: userInput.username }, { email: userInput.email }],
    });

    if (existingUser) {
      if (existingUser.username === userInput.username) {
        throw new Error('Username taken');
      }
      if (existingUser.email === userInput.email) {
        throw new Error('Email already registered');
      }
    }

    const user = new User({
      username: userInput.username,
      email: userInput.email,
    });
    const registeredUser = await User.register(user, userInput.password);

    const token = jwt.sign(
      {
        userId: registeredUser._id.toString(),
      },
      'jwtSecret',
      { expiresIn: '1h' }
    );
    return {
      ...registeredUser._doc,
      _id: registeredUser._id.toString(),
      token,
    };
  },
  login: async function ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await User.findOne({ username: username });
    if (!user) {
      const error = new Error('User not found');
      throw error;
    }
    console.log(user);
    const authenticateUser = User.authenticate();
    const authenticatedUser = await authenticateUser(username, password);

    if (!authenticatedUser) {
      throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    return {
      ...user._doc,
      _id: user._id.toString(),
      token,
    };
  },
  createPost: async function ({ postInput }: { postInput: any }, req: any) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!postInput.content || postInput.content.trim() === '') {
      throw new Error('Content should not be empty.');
    }

    const post = new Post({
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    console.log('Successfully posted');
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
};
