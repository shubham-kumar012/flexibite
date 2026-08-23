import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Food from '../models/Food.js';
import { uploadImageToS3 } from '../services/s3Service.js';

// Configure dotenv relative to script directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Migration script to upload existing local food dish webp images to AWS S3
 * and update corresponding MongoDB Food documents.
 */
const uploadFoodImagesToS3 = async () => {
  try {
    const serverDir = path.resolve(__dirname, '..');
    const foodsImagesDir = path.join(serverDir, 'data', 'foods');

    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    console.log(`Searching for food documents in MongoDB...`);
    const foods = await Food.find({});
    console.log(`Found ${foods.length} food documents.\n`);

    let totalFoods = foods.length;
    let imagesFoundCount = 0;
    let uploadedCount = 0;
    let alreadyUploadedCount = 0;
    let missingLocalCount = 0;
    let failedUploadCount = 0;

    const missingLocalDishes = [];
    const failedUploadDishes = [];

    console.log('Starting migration to AWS S3...\n');

    for (const food of foods) {
      const slug = food.slug;
      if (!slug) {
        console.warn(`[Skip] Food item ID ${food._id} has no slug.`);
        continue;
      }

      // Local webp file path
      const localImagePath = path.join(foodsImagesDir, `${slug}.webp`);
      const s3Key = `foods/${slug}.webp`;

      // Check if image already uploaded in MongoDB
      if (food.image && food.image.key && food.image.url) {
        alreadyUploadedCount++;
        imagesFoundCount++;
        // Keep moving to next item
        continue;
      }

      // Check if local image file exists
      if (!fs.existsSync(localImagePath)) {
        missingLocalCount++;
        missingLocalDishes.push(`${food.name} (${slug})`);
        continue;
      }

      imagesFoundCount++;

      try {
        const fileBuffer = fs.readFileSync(localImagePath);

        // Upload to AWS S3
        const uploadResult = await uploadImageToS3({
          buffer: fileBuffer,
          key: s3Key,
          contentType: 'image/webp',
        });

        // Update MongoDB document
        food.image = {
          url: uploadResult.url,
          key: uploadResult.key,
        };
        await food.save();

        uploadedCount++;
        console.log(`[Success] Uploaded & updated: ${food.name} -> ${s3Key}`);
      } catch (err) {
        failedUploadCount++;
        failedUploadDishes.push(`${food.name} (${slug}): ${err.message}`);
        console.error(`[Error] Failed uploading ${food.name}:`, err.message);
        // Continue processing remaining images
      }
    }

    console.log('\n==================================================');
    console.log('Food Image Migration to AWS S3 Completed');
    console.log('==================================================');
    console.log(`Total foods:             ${totalFoods}`);
    console.log(`Images found:            ${imagesFoundCount}`);
    console.log(`Uploaded to S3:          ${uploadedCount}`);
    console.log(`Already uploaded (skip): ${alreadyUploadedCount}`);
    console.log(`Missing local images:    ${missingLocalCount}`);
    console.log(`Failed uploads:          ${failedUploadCount}`);
    console.log('==================================================\n');

    if (missingLocalDishes.length > 0) {
      console.log('Missing Local Image Files:');
      missingLocalDishes.forEach((item) => console.log(` - ${item}`));
      console.log('');
    }

    if (failedUploadDishes.length > 0) {
      console.log('Failed Uploads:');
      failedUploadDishes.forEach((item) => console.log(` - ${item}`));
      console.log('');
    }

    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Migration script failed with critical error:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

uploadFoodImagesToS3();
