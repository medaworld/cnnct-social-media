"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Post_1 = __importDefault(require("../models/Post"));
const validatorUtils_1 = require("../utils/validatorUtils");
const cloudinaryUtils_1 = require("../utils/cloudinaryUtils");
const jwtSecret = process.env.JWT_SECRET;
exports.default = {
    createUser: async function ({ userInput }) {
        await (0, validatorUtils_1.validateUserInput)(userInput);
        const user = new User_1.default({
            username: userInput.username,
            email: userInput.email,
        });
        const registeredUser = await User_1.default.register(user, userInput.password);
        const token = jsonwebtoken_1.default.sign({
            userId: registeredUser._id.toString(),
        }, jwtSecret, { expiresIn: '1h' });
        return {
            ...registeredUser._doc,
            _id: registeredUser._id.toString(),
            token,
        };
    },
    login: async function ({ username, password, }) {
        const user = await User_1.default.findOne({ username: username });
        if (!user) {
            const error = new Error('Invalid credentials');
            throw error;
        }
        const authenticateUser = User_1.default.authenticate();
        const authenticatedUser = await authenticateUser(username, password);
        if (!authenticatedUser.user) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        return {
            ...user._doc,
            _id: user._id.toString(),
            token,
        };
    },
    createPost: async function ({ postInput }, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        if (!postInput.content || postInput.content.trim() === '') {
            throw new Error('Content should not be empty.');
        }
        try {
            const user = await User_1.default.findById(req.userId);
            if (!user) {
                throw new Error('User not authorized.');
            }
            const post = new Post_1.default({
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
        }
        catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Server error while creating post.');
        }
    },
    posts: async function (args, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            throw error;
        }
        const totalPosts = await Post_1.default.find().countDocuments();
        const posts = await Post_1.default.find()
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
    deletePost: async function ({ postId }, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const post = await Post_1.default.findById(postId);
        if (!post) {
            throw new Error('Post not found.');
        }
        if (post.creator._id.toString() !== req.userId.toString()) {
            throw new Error('Not authorized to delete this post');
        }
        if (post.image && post.image.id) {
            await (0, cloudinaryUtils_1.deleteFromCloudinary)(post.image.id);
        }
        await Post_1.default.findByIdAndRemove(postId);
        const user = await User_1.default.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        return { message: 'Post deleted successfully' };
    },
    user: async function (args, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            throw new Error('User not authorized');
        }
        return {
            ...user._doc,
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            image: {
                url: user.image.url,
            },
        };
    },
    userPosts: async function (args, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const user = await User_1.default.findOne({ username: args.username });
        if (!user) {
            throw new Error('User not found');
        }
        let userPosts;
        let totalPosts;
        if (user) {
            totalPosts = await Post_1.default.countDocuments({ creator: user._id });
            const nonmodUserPosts = await Post_1.default.find({ creator: user._id })
                .sort({ createdAt: -1 })
                .skip(args.skip)
                .limit(args.limit)
                .populate('creator');
            userPosts = nonmodUserPosts.map((post) => {
                return {
                    ...post._doc,
                    _id: post._id.toString(),
                    createdAt: post.createdAt.toISOString(),
                };
            });
        }
        return {
            ...user._doc,
            _id: user._id.toString(),
            user: user,
            posts: userPosts,
            totalPosts: totalPosts,
        };
    },
    userProfile: async function ({ username }, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const user = await User_1.default.findOne({ username: username });
        if (!user) {
            throw new Error('User not authorized');
        }
        return {
            ...user._doc,
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            image: {
                url: user.image.url,
            },
        };
    },
    addUserImage: async function ({ userImage }, req) {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            throw new Error('User not authorized');
        }
        if (user.image && user.image.id) {
            await (0, cloudinaryUtils_1.deleteFromCloudinary)(user.image.id);
        }
        user.image = userImage;
        const updatedUser = await user.save();
        return {
            ...updatedUser._doc,
            _id: updatedUser._id.toString(),
            image: updatedUser.image,
        };
    },
};
