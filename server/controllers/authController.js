import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default_secret_key_1234', {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation of required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 2. Check if email already exists in database
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // 3. Hash the plain text password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save new user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // 5. Generate JWT token for immediate login after signup
    const token = generateToken(user._id);

    // 6. Return response (excluding password)
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // 2. Find user in database by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // 3. Check user existence & compare password with stored bcrypt hash
    // (Use generic error message for security, preventing user enumeration)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return success response with user info and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Protected by authMiddleware)
 */
export const getMe = async (req, res) => {
  try {
    // req.userId is set by authMiddleware
    const user = await User.findById(req.userId).select('-password'); // '.select()' is mongoose function that excludes the password field from the query result

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('getMe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
export const logout = async (req, res) => {
  // With stateless JWT authentication, the backend simply returns a success response.
  // The client (React) is responsible for deleting the JWT token from localStorage/cookies.
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
