import { Result } from 'express-validator';
import { cloudinary } from '../config/cloudinary';

export const deleteFromCloudinary = (id: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, (error: Error, result: Result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
