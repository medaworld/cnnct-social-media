"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const MessageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
MessageSchema.index({ sender: 1, read: 1 });
const Message = mongoose_1.default.model('Message', MessageSchema);
exports.default = Message;
