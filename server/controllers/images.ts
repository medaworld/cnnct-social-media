import { NextFunction, Response } from 'express';

export const postImage = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    next(error);
  }
};
