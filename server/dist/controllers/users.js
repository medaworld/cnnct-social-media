"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
class CustomError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const user = new User_1.default({
            username,
            email,
        });
        const registeredUser = await User_1.default.register(user, password);
        if (registeredUser) {
            const token = jsonwebtoken_1.default.sign({ id: registeredUser._id }, jwtSecret, {
                expiresIn: '1h',
            });
            res
                .status(201)
                .json({ token, message: 'User Created!', userId: registeredUser._id });
            console.log('User created');
        }
    }
    catch (e) {
        if (e instanceof CustomError && !e.statusCode) {
            e.statusCode = 500;
        }
        next(e);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        if (req.user) {
            const user = req.user;
            const token = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, {
                expiresIn: '1h',
            });
            res
                .status(200)
                .json({ token, message: 'User logged in!', userId: user._id });
            console.log('User logged in');
        }
        else {
            throw new Error('Authentication failed.');
        }
    }
    catch (e) {
        if (e instanceof CustomError && !e.statusCode) {
            e.statusCode = 401;
        }
        next(e);
    }
};
exports.login = login;
