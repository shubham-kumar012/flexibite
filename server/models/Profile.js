import mongoose from 'mongoose';

// Profile Schema defining the user's basic health & nutrition profile
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    height: {
      value: {
        type: Number,
        required: [true, 'Height value is required'],
        min: [1, 'Height must be greater than 0'],
      },
      unit: {
        type: String,
        default: 'cm',
        enum: ['cm'],
      },
    },
    weight: {
      value: {
        type: Number,
        required: [true, 'Weight value is required'],
        min: [1, 'Weight must be greater than 0'],
      },
      unit: {
        type: String,
        default: 'kg',
        enum: ['kg'],
      },
    },
    activityLevel: {
      type: String,
      required: [true, 'Activity level is required'],
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'],
    },
    goal: {
      type: String,
      required: [true, 'Goal is required'],
      enum: ['lose_weight', 'maintain_weight', 'gain_weight'],
    },
    targetWeight: {
      value: {
        type: Number,
        min: [1, 'Target weight must be greater than 0'],
      },
      unit: {
        type: String,
        default: 'kg',
        enum: ['kg'],
      },
    },
    dietaryPreference: {
      type: String,
      required: [true, 'Dietary preference is required'],
      enum: ['vegan', 'vegetarian', 'eggetarian', 'non_vegetarian'],
    },
    allergies: {
      type: [String],
      default: [],
    },
    dislikedFoods: {
      type: [String],
      default: [],
    },
    onboardingCompleted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
