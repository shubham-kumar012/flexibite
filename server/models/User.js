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
    // Password is required only for local email/password authentication
    password: {
      type: String,
      required: [
        function () {
          return this.authProvider === 'local';
        },
        'Password is required for local accounts',
      ],
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple local users to have null googleId without index collisions
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    profileImage: {
      type: String,
      default: '',
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