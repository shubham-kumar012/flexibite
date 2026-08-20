import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Script to grant admin privileges (role: "admin") to a user by email.
 * Usage: node scripts/makeAdmin.js <email>
 */
const makeAdmin = async () => {
  const emailInput = process.argv[2];

  if (!emailInput) {
    console.log('Usage: node scripts/makeAdmin.js <user-email>');
    console.log('Example: node scripts/makeAdmin.js admin@flexibite.com');
    process.exit(1);
  }

  const cleanEmail = emailInput.toLowerCase().trim();

  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.error(`User with email '${cleanEmail}' not found.`);
      await mongoose.connection.close();
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully updated ${user.name} (${user.email}) to role: 'admin'.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

makeAdmin();
