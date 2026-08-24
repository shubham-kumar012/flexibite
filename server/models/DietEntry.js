import mongoose from 'mongoose';

/**
 * DietEntry Schema
 * 
 * We store a snapshot of the nutrition values at the exact moment the food is logged.
 * This ensures historical diet logs remain accurate even if the master food database
 * is modified or updated at a later date.
 */
const dietEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: [true, 'Food ID is required'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: {
        values: ['breakfast', 'lunch', 'dinner', 'snack'],
        message: 'Meal type must be breakfast, lunch, dinner, or snack',
      },
      lowercase: true,
      trim: true,
    },
    serving: {
      name: {
        type: String,
        required: [true, 'Serving name is required'],
      },
      grams: {
        type: Number,
        required: [true, 'Serving grams is required'],
        min: [1, 'Serving grams must be greater than 0'],
      },
    },
    // Nutrition snapshot calculated based on selected serving grams
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
      fibre: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const DietEntry = mongoose.model('DietEntry', dietEntrySchema);

export default DietEntry;
