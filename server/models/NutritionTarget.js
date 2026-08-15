import mongoose from 'mongoose';

/**
 * NutritionTarget Schema defining user's daily calorie and macro goals
 */
const nutritionTargetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    bmr: {
      type: Number,
      required: [true, 'BMR is required'],
    },
    activityMultiplier: {
      type: Number,
      required: [true, 'Activity multiplier is required'],
    },
    tdee: {
      type: Number,
      required: [true, 'TDEE is required'],
    },
    goal: {
      type: String,
      required: [true, 'Goal is required'],
      enum: ['lose_weight', 'maintain_weight', 'gain_weight'],
    },
    calories: {
      type: Number,
      required: [true, 'Calorie target is required'],
    },
    protein: {
      type: Number,
      required: [true, 'Protein target is required'],
    },
    carbohydrates: {
      type: Number,
      required: [true, 'Carbohydrate target is required'],
    },
    fat: {
      type: Number,
      required: [true, 'Fat target is required'],
    },
    calculationVersion: {
      type: String,
      default: '1.0',
    },
  },
  {
    timestamps: true,
  }
);

const NutritionTarget = mongoose.model('NutritionTarget', nutritionTargetSchema);

export default NutritionTarget;
