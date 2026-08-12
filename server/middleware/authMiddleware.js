import jwt from 'jsonwebtoken';

// Middleware to protect routes and verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the Authorization header from incoming request
    const authHeader = req.headers.authorization;

    // 2. Check if header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided',
      });
    }

    // 3. Extract token string (split by space: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // 4. Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach decoded userId to request object for downstream controllers
    req.userId = decoded.userId;

    // 6. Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // Return 401 if token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid or expired token',
    });
  }
};

export default authMiddleware;
