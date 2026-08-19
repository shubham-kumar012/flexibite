import mongoose from 'mongoose';

/**
 * Nutrition schema for values per 100g
 */
const nutritionPer100gSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    freeSugar: { type: Number, default: 0 },
    fibre: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    folate: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * Serving size schema
 */
const servingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    grams: { type: Number, required: true },
  },
  { _id: false }
);

/**
 * Food Schema defining food items in the database
 */
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    dietaryType: {
      type: String,
      enum: ['vegan', 'vegetarian', 'eggetarian', 'non_vegetarian', 'unknown'],
      default: 'unknown',
    },
    nutritionPer100g: {
      type: nutritionPer100gSchema,
      default: () => ({}),
    },
    servings: {
      type: [servingSchema],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      url: { type: String, default: '' },
      key: { type: String, default: '' },
    },
    source: {
      dataset: { type: String, default: 'Indian Food Nutrition Dataset' },
      license: { type: String, default: '' },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model('Food', foodSchema);

export default Food;
