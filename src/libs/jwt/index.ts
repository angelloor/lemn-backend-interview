import jwt from 'jsonwebtoken';
import { Payload, SignInPayload } from './jwt.types';

const KEY_JWT = process.env.JWT_SECRET || process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (payload: SignInPayload, expiresIn = 180): string => {
  return jwt.sign(payload, KEY_JWT, { expiresIn });
};

export const verifyToken = (token: string): Payload => {
  try {
    return jwt.verify(token, KEY_JWT) as Payload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
