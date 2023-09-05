"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PostSchema = new Schema({
    content: {
        type: String,
        required: true,
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
const Post = mongoose_1.default.model('Post', PostSchema);
exports.default = Post;
