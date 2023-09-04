const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config({ path: './.env.local' });

export const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `${process.env.CLOUDINARY_FOLDER}/post`,
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

export const userImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: `${process.env.CLOUDINARY_FOLDER}/user`,
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});
