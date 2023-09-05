"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ConversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
}, { timestamps: true });
ConversationSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await mongoose_1.default.model('Message').deleteMany({ conversation: doc._id });
    }
});
const Conversation = mongoose_1.default.model('Conversation', ConversationSchema);
exports.default = Conversation;
