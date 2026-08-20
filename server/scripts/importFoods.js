import fs from 'fs';
import path from 'path';
import fileURLToPath from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Food from '../models/Food.js';
import {
  parseCSV,
  mapFoodRow,
  checkImageExists,
} from '../utils/foodHelpers.js';

// Load environment variables from server/.env
dotenv.config();

/**
 * Script to import food data from CSV into MongoDB with upsert support.
 */
const importFoods = async () => {
  try {
    // Determine path relative to this script or process root
    const scriptDir = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
    const serverDir = path.resolve(scriptDir, '..');
    const csvPath = path.join(serverDir, 'data', 'food_data.csv');
    const foodsImagesDir = path.join(serverDir, 'data', 'foods');

    console.log('Connecting to MongoDB...');
    await connectDB();

    if (!fs.existsSync(csvPath)) {
      console.error(`Error: CSV file not found at ${csvPath}`);
      process.exit(1);
    }

    console.log(`Reading CSV from ${csvPath}...`);
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const rawRows = parseCSV(csvContent);

    let totalCSVRecords = rawRows.length;
    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let imagesFoundCount = 0;
    let imagesMissingCount = 0;

    const missingImageSlugs = [];
    const invalidRecordNames = [];

    console.log(`Processing ${totalCSVRecords} records...`);

    for (const row of rawRows) {
      const foodData = mapFoodRow(row);

      // Validation check
      if (!foodData.name || !foodData.slug || !foodData.category) {
        invalidRecordNames.push(foodData.name || 'Unnamed Dish');
        skippedCount++;
        continue;
      }

      // Check if image exists locally
      const imageExists = checkImageExists(foodData.slug, foodsImagesDir);
      if (imageExists) {
        imagesFoundCount++;
      } else {
        imagesMissingCount++;
        missingImageSlugs.push(foodData.name);
        console.warn(`Warning: image not found for ${foodData.name} (${foodData.slug})`);
      }

      // Upsert into MongoDB by slug
      const existingDoc = await Food.findOne({ slug: foodData.slug });

      if (existingDoc) {
        await Food.updateOne({ slug: foodData.slug }, foodData);
        updatedCount++;
      } else {
        await Food.create(foodData);
        createdCount++;
      }
    }

    console.log('\nFood import completed.\n');
    console.log(`Total CSV records: ${totalCSVRecords}`);
    console.log(`Created: ${createdCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    if (invalidRecordNames.length > 0) {
      console.log(`Invalid records: ${invalidRecordNames.length}`);
      invalidRecordNames.forEach((item) => console.log(` - ${item}`));
    }
    console.log('');
    console.log(`Images found: ${imagesFoundCount}`);
    console.log(`Images missing: ${imagesMissingCount}`);
    if (missingImageSlugs.length > 0) {
      console.log('Missing images for:');
      missingImageSlugs.forEach((slugName) => console.log(` - ${slugName}`));
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Import failed with error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

importFoods();
