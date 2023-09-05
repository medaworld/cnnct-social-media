"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
function default_1(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
    }
    catch (err) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.id;
    req.isAuth = true;
    next();
}
exports.default = default_1;
