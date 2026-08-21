import mongoose from 'mongoose';

// Function to connect Express server to MongoDB database
const connectDB = async () => {
  try {
    // Read MongoDB connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure code if database connection fails
    process.exit(1);
  }
};

export default connectDB;