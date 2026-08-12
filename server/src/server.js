import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flexibite';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'FlexiBite Backend API',
    timestamp: new Date().toISOString(),
  });
});

// MongoDB Connection (Optional for initial landing page development)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.warn('⚠️ MongoDB connection warning:', err.message));
}

app.listen(PORT, () => {
  console.log(`🚀 FlexiBite backend server running on http://localhost:${PORT}`);
});
