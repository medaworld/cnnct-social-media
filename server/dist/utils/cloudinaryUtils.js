"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = void 0;
const cloudinary_1 = require("../config/cloudinary");
const deleteFromCloudinary = (id) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.cloudinary.uploader.destroy(id, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
