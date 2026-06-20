import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signAccess(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}
export function signRefresh(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
export function verifyAccess(token: string) {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}
export function verifyRefresh(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
}
