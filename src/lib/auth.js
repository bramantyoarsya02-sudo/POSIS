import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'posis-smkn1ciomas-secret-key-2026';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAuthUser(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

