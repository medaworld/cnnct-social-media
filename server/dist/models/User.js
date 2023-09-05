"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        url: {
            type: String,
            required: false,
        },
        id: {
            type: String,
            required: false,
        },
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    conversations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
        },
    ],
});
UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await mongoose_1.default.model('Message').deleteMany({ sender: doc._id });
        await mongoose_1.default.model('Conversation').deleteMany({ participants: doc._id });
    }
});
UserSchema.plugin(passport_local_mongoose_1.default);
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
