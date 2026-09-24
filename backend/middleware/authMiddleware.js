import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stockai_super_secret_jwt_key_2026';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Also support userEmail from custom header for flexibility
  const customEmail = req.headers['x-user-email'];

  if (!token && !customEmail) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id || decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    } else if (customEmail) {
      req.user = {
        id: customEmail.toLowerCase(),
        email: customEmail.toLowerCase(),
        name: customEmail.split('@')[0],
      };
    }
    next();
  } catch (error) {
    console.error('Auth token verification error:', error.message);
    if (customEmail) {
      req.user = {
        id: customEmail.toLowerCase(),
        email: customEmail.toLowerCase(),
        name: customEmail.split('@')[0],
      };
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};
