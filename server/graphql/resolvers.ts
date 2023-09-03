import { Request } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Post from '../models/Post';
import { validateUserInput } from '../utils/validatorUtils';
import { cloudinary } from '../config/cloudinary';

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
      throw new Error('Not authenticated');
    }

    if (!postInput.content || postInput.content.trim() === '') {
      throw new Error('Content should not be empty.');
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error('User not found.');
      }

      const post = new Post({
        content: postInput.content,
        image: postInput.image || null,
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
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Server error while creating post.');
    }
  },

  posts: async function (args: any, req: any) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      throw error;
    }
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(args.skip)
      .limit(args.limit)
      .populate('creator');

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  deletePost: async function ({ postId }: { postId: string }, req: any) {
    if (!req.isAuth) {
      throw new Error('Not authenticated');
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error('Post not found.');
      }
      if (post.creator._id.toString() !== req.userId.toString()) {
        throw new Error('Not authorized to delete this post');
      }

      if (post.image) {
        cloudinary.uploader.destroy(
          post.image.id,
          (error: string, result: string) => {
            if (error) {
              console.error('Error deleting image from Cloudinary:', error);
            } else {
              console.log('Image deleted successfully:', result);
            }
          }
        );
      }

      await Post.findByIdAndRemove(postId);

      const user = await User.findById(req.userId);
      user.posts.pull(postId);
      await user.save();

      return { message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Server error while creating post.');
    }
  },
};
