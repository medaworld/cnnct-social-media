import { Request, Response, NextFunction } from 'express';

export const setCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.currentUser = req.user;
  next();
};
