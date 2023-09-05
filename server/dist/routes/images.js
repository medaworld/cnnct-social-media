"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
const express_1 = __importDefault(require("express"));
const images_1 = require("../controllers/images");
const router = express_1.default.Router();
const postImageUpload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const userImageUpload = (0, multer_1.default)({ storage: cloudinary_1.userImageStorage });
router.post('/post-image', postImageUpload.single('image'), images_1.postImage);
router.post('/user-image', userImageUpload.single('image'), images_1.postImage);
exports.default = router;
