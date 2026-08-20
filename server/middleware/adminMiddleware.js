import User from '../models/User.js';

/**
 * Middleware to restrict route access strictly to admin users.
 * Must be executed AFTER authMiddleware (protect) so req.userId is set.
 */
export const adminOnly = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No authentication context',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Admin access required',
      });
    }

    // Attach user object to request for downstream controller handlers if needed
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authorization middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check',
    });
  }
};
