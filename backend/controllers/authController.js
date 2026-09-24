import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stockai_super_secret_jwt_key_2026';

// In-memory fallback user database if MongoDB Atlas is offline
const memoryUsers = new Map();

// Initialize default demo user (arjun@stockai.com / demo123)
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('demo123', salt);
  memoryUsers.set('arjun@stockai.com', {
    id: 'user_demo_arjun',
    name: 'Arjun Trader',
    email: 'arjun@stockai.com',
    password: hashedPassword,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    premium: true,
  });
})();

const generateToken = (id, email, name) => {
  return jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a brand new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters.' });
    }

    // 1. Check if user exists in MongoDB
    if (getDBStatus()) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
        });

        const token = generateToken(newUser._id, newUser.email, newUser.name);

        return res.status(201).json({
          success: true,
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
            premium: newUser.premium,
          },
          message: 'Account registered successfully.',
        });
      } catch (dbErr) {
        console.warn('MongoDB register fallback to memory store:', dbErr.message);
      }
    }

    // 2. Memory store check
    if (memoryUsers.has(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `user_${Date.now()}`;

    const userObj = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      premium: true,
    };

    memoryUsers.set(cleanEmail, userObj);
    const token = generateToken(userId, cleanEmail, name.trim());

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        avatar: userObj.avatar,
        premium: userObj.premium,
      },
      message: 'Account registered successfully.',
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate registered user & get token (Strict check)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check MongoDB
    if (getDBStatus()) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = generateToken(user._id, user.email, user.name);
            return res.json({
              success: true,
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                premium: user.premium,
              },
            });
          } else {
            return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB login fallback to memory store:', dbErr.message);
      }
    }

    // 2. Check Memory store
    const memUser = memoryUsers.get(cleanEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (isMatch) {
        const token = generateToken(memUser.id, memUser.email, memUser.name);
        return res.json({
          success: true,
          token,
          user: {
            id: memUser.id,
            name: memUser.name,
            email: memUser.email,
            avatar: memUser.avatar,
            premium: memUser.premium,
          },
        });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      }
    }

    // 3. User is NOT registered in database
    return res.status(404).json({
      success: false,
      message: 'Account not found with this email. Please register first to create your account.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
export const getMe = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (getDBStatus()) {
      try {
        const user = await User.findOne({ email: userEmail }).select('-password');
        if (user) {
          return res.json({ success: true, user });
        }
      } catch (e) {
        // fallback
      }
    }

    const memUser = memoryUsers.get(userEmail);
    if (memUser) {
      const { password, ...safeUser } = memUser;
      return res.json({ success: true, user: safeUser });
    }

    return res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name || 'StockAI Trader',
        email: userEmail,
        premium: true,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
