import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { getGoogleAuthUrl, getGoogleUserInfo } from '../utils/googleAuth.js';

// Helper function to generate standard FlexiBite JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default_secret_key_1234', {
    expiresIn: '7d', // Token valid for 7 days
  });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user with email & password
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
      authProvider: 'local',
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
        role: user.role,
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // If user signed up via Google only and has no password
    if (!user.password && user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please click "Continue with Google".',
      });
    }

    // 3. Compare password with stored bcrypt hash
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
        role: user.role,
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
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth login by redirecting browser to Google consent screen
 * @access  Public
 */
export const googleAuth = (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Google OAuth credentials missing in environment variables.');
      return res.redirect(`${clientUrl}/login?error=google_not_configured`);
    }

    const authUrl = getGoogleAuthUrl();
    return res.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Google auth:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return res.redirect(`${clientUrl}/login?error=google_init_failed`);
  }
};

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback, verify profile, generate FlexiBite JWT, and redirect to React
 * @access  Public
 */
export const googleAuthCallback = async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  try {
    const { code, error } = req.query;

    // Handle user cancelling Google consent or missing code
    if (error || !code) {
      return res.redirect(`${clientUrl}/login?error=google_cancelled`);
    }

    // Google sends us a temporary authorization code.
    // We exchange it for tokens so we can verify the user's Google identity.
    const googleUser = await getGoogleUserInfo(code);

    if (!googleUser || !googleUser.email) {
      return res.redirect(`${clientUrl}/login?error=google_profile_failed`);
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();

    // 1. Search for existing user by googleId first
    let user = await User.findOne({ googleId: googleUser.googleId });

    // 2. If not found by googleId, check by email (safely link Google to existing local account)
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });

      if (user) {
        if (!user.googleId) {
          user.googleId = googleUser.googleId;
        }
        if (!user.profileImage && googleUser.picture) {
          user.profileImage = googleUser.picture;
        }
        await user.save();
      }
    }

    // 3. New Google user -> create user record in MongoDB
    if (!user) {
      user = await User.create({
        name: googleUser.name || 'FlexiBite User',
        email: normalizedEmail,
        googleId: googleUser.googleId,
        authProvider: 'google',
        profileImage: googleUser.picture || '',
      });
    }

    // 4. Generate the SAME FlexiBite JWT token used by normal login
    const token = generateToken(user._id);

    // 5. Check onboarding completion status from user's Profile
    const profile = await Profile.findOne({ userId: user._id });
    const isCompleted = Boolean(profile && (profile.onboardingCompleted || profile.profileCompleted));

    const redirectTo = isCompleted ? '/dashboard' : '/onboarding';

    // 6. Redirect to React frontend callback handler
    return res.redirect(`${clientUrl}/auth/callback?token=${token}&redirectTo=${redirectTo}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error.message);
    return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Protected by authMiddleware)
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

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
        role: user.role,
        authProvider: user.authProvider,
        profileImage: user.profileImage,
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
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
