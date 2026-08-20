import mongoose from 'mongoose';

// User Schema defining the user data structure in MongoDB
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' timestamps
    timestamps: true,
  }
);

// Create Mongoose User model
const User = mongoose.model('User', userSchema);

export default User;