import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Food from '../models/Food.js';
import { checkImageExists } from '../utils/foodHelpers.js';

dotenv.config();

const ALLOWED_DIETARY_TYPES = ['vegan', 'vegetarian', 'eggetarian', 'non_vegetarian', 'unknown'];

/**
 * Validation script to inspect all stored food documents in MongoDB.
 */
const validateFoods = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const scriptDir = path.dirname(__filename);
    const serverDir = path.resolve(scriptDir, '..');
    const foodsImagesDir = path.join(serverDir, 'data', 'foods');

    console.log('Connecting to MongoDB for validation...');
    await connectDB();

    const foods = await Food.find({});
    console.log(`Found ${foods.length} food documents in MongoDB.\n`);

    const issues = [];
    const slugMap = new Map();
    let validCount = 0;
    let missingImagesCount = 0;

    for (const food of foods) {
      const foodIssues = [];

      // Check name
      if (!food.name || food.name.trim() === '') {
        foodIssues.push('Missing dish name');
      }

      // Check category
      if (!food.category || food.category.trim() === '') {
        foodIssues.push('Missing category');
      }

      // Check slug duplicate
      if (!food.slug || food.slug.trim() === '') {
        foodIssues.push('Missing slug');
      } else if (slugMap.has(food.slug)) {
        foodIssues.push(`Duplicate slug detected: ${food.slug}`);
      } else {
        slugMap.set(food.slug, food._id);
      }

      // Check dietary type
      if (!ALLOWED_DIETARY_TYPES.includes(food.dietaryType)) {
        foodIssues.push(`Invalid dietaryType: ${food.dietaryType}`);
      }

      // Check nutrition values
      const nutrition = food.nutritionPer100g || {};
      const fieldsToCheck = [
        'calories',
        'carbohydrates',
        'protein',
        'fats',
        'freeSugar',
        'fibre',
        'sodium',
        'calcium',
        'iron',
        'vitaminC',
        'folate',
      ];

      for (const field of fieldsToCheck) {
        const val = nutrition[field];
        if (val === undefined || val === null || isNaN(val) || val < 0) {
          foodIssues.push(`Invalid nutrition field '${field}': ${val}`);
        }
      }

      // Check local image
      const hasImage = checkImageExists(food.slug, foodsImagesDir);
      if (!hasImage) {
        missingImagesCount++;
        foodIssues.push(`Local image missing on disk (foods/${food.slug}/image.webp)`);
      }

      if (foodIssues.length === 0) {
        validCount++;
      } else {
        issues.push({
          dish: food.name || food.slug || 'Unknown',
          issues: foodIssues,
        });
      }
    }

    console.log('========================================');
    console.log('Food Validation Summary');
    console.log('========================================');
    console.log(`Total Food Documents: ${foods.length}`);
    console.log(`Fully Valid Documents: ${validCount}`);
    console.log(`Documents with missing disk images: ${missingImagesCount}`);
    console.log(`Documents with critical validation errors: ${issues.filter((i) => i.issues.some((e) => !e.includes('Local image missing'))).length}`);
    console.log('========================================\n');

    if (issues.length > 0) {
      console.log('Details of items with notes/issues:');
      issues.forEach((item) => {
        console.log(`\n- Dish: ${item.dish}`);
        item.issues.forEach((issue) => console.log(`   * ${issue}`));
      });
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Validation script failed with error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

validateFoods();
