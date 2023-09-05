"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const users_1 = require("../controllers/users");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty()
        .custom(async (value, { req }) => {
        const userDoc = await User_1.default.findOne({ username: value });
        if (userDoc) {
            return Promise.reject('Username already exists!');
        }
    }),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
        .custom(async (value, { req }) => {
        const userDoc = await User_1.default.findOne({ email: value });
        if (userDoc) {
            return Promise.reject('Email address already exists!');
        }
    }),
    (0, express_validator_1.body)('password').trim().isLength({ min: 3 }),
], users_1.register);
router.post('/login', passport_1.default.authenticate('local'), users_1.login);
exports.default = router;
