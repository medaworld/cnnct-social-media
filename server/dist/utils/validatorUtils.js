"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserInput = void 0;
const User_1 = __importDefault(require("../models/User"));
async function validateUserInput(userInput) {
    if (!userInput.username || userInput.username.trim() === '') {
        throw new Error('Username should not be empty.');
    }
    if (!userInput.email ||
        !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(userInput.email)) {
        throw new Error('Please enter a valid email.');
    }
    const existingUser = await User_1.default.findOne({
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
    if (!userInput.password || userInput.password.length < 3) {
        throw new Error('Password should be at least 3 characters long.');
    }
}
exports.validateUserInput = validateUserInput;
