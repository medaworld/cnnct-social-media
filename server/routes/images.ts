import multer from 'multer';
import { storage, userImageStorage } from '../config/cloudinary';
import express from 'express';
import { postImage } from '../controllers/images';

const router = express.Router();
const postImageUpload = multer({ storage });
const userImageUpload = multer({ storage: userImageStorage });

router.post('/post-image', postImageUpload.single('image'), postImage);

router.post('/user-image', userImageUpload.single('image'), postImage);

export default router;
