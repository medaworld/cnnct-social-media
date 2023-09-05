"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketMessages = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const Message_1 = __importDefault(require("../models/Message"));
const authUtils_1 = require("../utils/authUtils");
const handleSocketMessages = (io, socketToUserIdMap) => {
    io.on('connection', (socket) => {
        socket.on('authenticate', (token) => {
            const userId = (0, authUtils_1.getUserIdFromToken)(token);
            if (userId) {
                socketToUserIdMap.set(socket.id, userId);
                console.log(`Authenticated socket ${socket.id} for user ${userId}`);
            }
            else {
                console.error('Failed to authenticate socket', socket.id);
            }
        });
        socket.on('join_room', async (conversationId) => {
            socket.join(conversationId);
            try {
                const senderId = socketToUserIdMap.get(socket.id);
                const conversation = await Conversation_1.default.findById(conversationId).populate({
                    path: 'participants',
                    select: 'username image',
                });
                const recipient = conversation.participants.find((participant) => {
                    return participant._id.toString() !== senderId;
                });
                if (!conversation) {
                    console.error(`Conversation with ID ${conversationId} not found.`);
                    return;
                }
                const previousMessages = await Message_1.default.find({
                    conversation: conversationId,
                })
                    .sort('createdAt')
                    .limit(20);
                socket.emit('initial_data', {
                    recipient: recipient,
                    messages: previousMessages,
                });
            }
            catch (err) {
                console.error('Error fetching previous messages:', err);
            }
        });
        socket.on('send_message', async (conversationId, messageContent) => {
            const senderId = socketToUserIdMap.get(socket.id);
            if (!senderId) {
                console.error('Failed to find sender for this socket connection.');
                return;
            }
            io.to(conversationId).emit('receive_message', {
                sender: senderId,
                content: messageContent,
                createdAt: new Date(),
            });
            try {
                const newMessage = new Message_1.default({
                    content: messageContent,
                    sender: senderId,
                    conversation: conversationId,
                });
                await newMessage.save();
            }
            catch (err) {
                console.error('Error saving message:', err);
            }
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
exports.handleSocketMessages = handleSocketMessages;
