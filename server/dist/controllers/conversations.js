"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.postConversation = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const postConversation = async (req, res) => {
    if (!req.isAuth) {
        const error = new Error('Not authenticated');
        throw error;
    }
    const currentUserId = req.userId;
    const recipientId = req.body.userId;
    try {
        let conversation = await Conversation_1.default.findOne({
            participants: { $all: [currentUserId, recipientId] },
        });
        if (!conversation) {
            conversation = new Conversation_1.default({
                participants: [currentUserId, recipientId],
            });
            await conversation.save();
        }
        res.json({ conversationId: conversation._id });
    }
    catch (err) {
        console.error('Error in startOrFetchConversation:', err);
        res.status(500).send('Internal Server Error');
    }
};
exports.postConversation = postConversation;
const getConversation = async (req, res) => {
    if (!req.isAuth) {
        const error = new Error('Not authenticated');
        throw error;
    }
    const userId = req.userId;
    try {
        const conversations = await Conversation_1.default.find({
            participants: userId,
        }).populate({
            path: 'participants',
            select: 'username image',
        });
        const updatedConversations = conversations.map((conv) => {
            const recipient = conv.participants.find((participant) => {
                return participant._id.toString() !== userId;
            });
            const newConv = {
                ...conv._doc,
                recipient,
            };
            delete newConv.participants;
            return newConv;
        });
        return res.json(updatedConversations);
    }
    catch (err) {
        console.error('Error fetching user conversations:', err);
        res.status(500).send('Internal Server Error');
    }
};
exports.getConversation = getConversation;
