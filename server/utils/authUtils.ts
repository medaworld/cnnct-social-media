import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.JWT_SECRET!;

export function getUserIdFromToken(token: string): string | null {
  try {
    const decodedToken: any = jwt.verify(token, jwtSecret);
    return decodedToken.id;
  } catch (err) {
    return null;
  }
}
