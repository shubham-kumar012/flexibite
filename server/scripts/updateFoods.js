import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Food from '../models/Food.js';

// Load environment variables from server/.env
dotenv.config();

/**
 * Script to update food items in MongoDB using server/data/combined_updated_foods.json
 * Updates dietaryType, servings, allergens, and tags based on _id or slug.
 */
const updateFoods = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const serverDir = path.resolve(__dirname, '..');
    const jsonPath = path.join(serverDir, 'data', 'combined_updated_foods.json');

    console.log('Connecting to MongoDB...');
    await connectDB();

    if (!fs.existsSync(jsonPath)) {
      console.error(`Error: JSON file not found at ${jsonPath}`);
      process.exit(1);
    }

    console.log(`Reading JSON data from ${jsonPath}...`);
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const updatedFoods = JSON.parse(fileContent);

    if (!Array.isArray(updatedFoods) || updatedFoods.length === 0) {
      console.log('No food items found in the JSON file.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${updatedFoods.length} items in JSON. Preparing update operations...`);

    const bulkOps = [];
    const skippedItems = [];

    for (const item of updatedFoods) {
      const hasValidId = item._id && mongoose.Types.ObjectId.isValid(item._id);
      const hasSlug = Boolean(item.slug);

      if (!hasValidId && !hasSlug) {
        skippedItems.push(item.name || 'Unknown dish');
        continue;
      }

      // Build search filter: match by _id or fallback to slug
      let filter;
      if (hasValidId && hasSlug) {
        filter = { $or: [{ _id: item._id }, { slug: item.slug }] };
      } else if (hasValidId) {
        filter = { _id: item._id };
      } else {
        filter = { slug: item.slug };
      }

      // Fields to update as requested
      const updateFields = {};
      if (item.dietaryType !== undefined) updateFields.dietaryType = item.dietaryType;
      if (item.servings !== undefined) updateFields.servings = item.servings;
      if (item.allergens !== undefined) updateFields.allergens = item.allergens;
      if (item.tags !== undefined) updateFields.tags = item.tags;
      if (item.nutritionPer100g !== undefined) updateFields.nutritionPer100g = item.nutritionPer100g;

      bulkOps.push({
        updateOne: {
          filter,
          update: { $set: updateFields },
        },
      });
    }

    if (bulkOps.length === 0) {
      console.log('No valid food records to update.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Executing bulk update for ${bulkOps.length} records...`);
    const result = await Food.bulkWrite(bulkOps);

    console.log('\n--- Food Update Summary ---');
    console.log(`Total items in JSON:  ${updatedFoods.length}`);
    console.log(`Operations sent:     ${bulkOps.length}`);
    console.log(`Matched in Database: ${result.matchedCount}`);
    console.log(`Modified / Updated:  ${result.modifiedCount}`);
    if (skippedItems.length > 0) {
      console.log(`Skipped (invalid ID & slug): ${skippedItems.length}`);
    }
    console.log('---------------------------\n');

    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Update script failed with error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

updateFoods();
