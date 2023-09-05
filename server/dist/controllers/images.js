"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImage = void 0;
const postImage = async (req, res, next) => {
    try {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        if (!req.file) {
            return res.status(200).json({ message: 'No file provided' });
        }
        res.status(201).json({
            message: 'File stored.',
            filePath: req.file.path,
            publicId: req.file.filename,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.postImage = postImage;
