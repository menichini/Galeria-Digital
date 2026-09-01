// JWT utility for admin authentication
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secret'; // In production set a strong secret

export interface AdminTokenPayload {
  admin: true;
}

export function signAdminToken(): string {
  const payload: AdminTokenPayload = { admin: true };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch (e) {
    console.error('Invalid admin token', e);
    return null;
  }
}
