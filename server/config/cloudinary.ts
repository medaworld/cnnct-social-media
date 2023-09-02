const { CloudinaryStorage } = require('multer-storage-cloudinary');

export const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cnnct',
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});
