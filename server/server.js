import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

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

// Connect to MongoDB and start express server
const startServer = async () => {
  await connectDB(); // connectDB is a function that connects to the MongoDB database
  app.listen(PORT, () => {
    console.log(`FlexiBite Server listening on http://localhost:${PORT}`);
  });
};

startServer();
