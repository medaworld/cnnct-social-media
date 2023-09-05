"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userImageStorage = exports.storage = exports.cloudinary = void 0;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: './.env.local' });
exports.cloudinary = require('cloudinary').v2;
exports.cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
exports.storage = new CloudinaryStorage({
    cloudinary: exports.cloudinary,
    params: {
        folder: `${process.env.CLOUDINARY_FOLDER}/post`,
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});
exports.userImageStorage = new CloudinaryStorage({
    cloudinary: exports.cloudinary,
    params: {
        folder: `${process.env.CLOUDINARY_FOLDER}/user`,
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});
