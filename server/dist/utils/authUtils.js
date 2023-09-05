"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
function getUserIdFromToken(token) {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        return decodedToken.id;
    }
    catch (err) {
        return null;
    }
}
exports.getUserIdFromToken = getUserIdFromToken;
