import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import nutritionTargetRoutes from './routes/nutritionTargetRoutes.js';
import adminFoodRoutes from './routes/adminFoodRoutes.js';
import userFoodRoutes from './routes/userFoodRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Configure CORS middleware to allow requests from the React frontend
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Profile Routes
app.use('/api/profile', profileRoutes);

// Nutrition Target Routes
app.use('/api/nutrition-targets', nutritionTargetRoutes);

// User Food Discovery Routes
app.use('/api/foods', userFoodRoutes);

// Admin Food Routes
app.use('/api/admin/foods', adminFoodRoutes);

// Connect to MongoDB and start express server
const startServer = async () => {
  await connectDB(); // connectDB is a function that connects to the MongoDB database
  app.listen(PORT, () => {
    console.log(`FlexiBite Server listening on http://localhost:${PORT}`);
  });
};

startServer();
