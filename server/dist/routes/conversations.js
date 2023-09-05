"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversations_1 = require("../controllers/conversations");
const router = express_1.default.Router();
router.post('/post-conversation', conversations_1.postConversation);
router.get('/get-conversation', conversations_1.getConversation);
exports.default = router;
