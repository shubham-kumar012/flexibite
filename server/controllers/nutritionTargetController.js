import Profile from '../models/Profile.js';
import NutritionTarget from '../models/NutritionTarget.js';
import { calculateNutritionTargets } from '../utils/nutritionCalculator.js';

/**
 * @route   POST /api/nutrition-targets/generate
 * @desc    Generate or update current authenticated user's nutrition targets based on latest profile
 * @access  Private (Protected by authMiddleware)
 */
export const generateNutritionTarget = async (req, res) => {
  try {
    // 1. Fetch user's profile
    const profile = await Profile.findOne({ userId: req.userId });

    // 2. Validate profile completeness
    if (
      !profile ||
      !profile.onboardingCompleted ||
      !profile.age ||
      !profile.height?.value ||
      !profile.weight?.value ||
      !profile.activityLevel ||
      !profile.goal
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete your profile before generating nutrition targets.',
      });
    }

    // 3. Perform nutrition calculation
    const calculated = calculateNutritionTargets(profile);

    // 4. Upsert NutritionTarget document
    const nutritionTarget = await NutritionTarget.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          userId: req.userId,
          bmr: calculated.bmr,
          activityMultiplier: calculated.activityMultiplier,
          tdee: calculated.tdee,
          goal: profile.goal,
          calories: calculated.calories,
          protein: calculated.protein,
          carbohydrates: calculated.carbohydrates,
          fat: calculated.fat,
          calculationVersion: '1.0',
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Nutrition target generated successfully',
      nutritionTarget,
    });
  } catch (error) {
    console.error('Error generating nutrition target:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error generating nutrition targets',
    });
  }
};

/**
 * @route   GET /api/nutrition-targets
 * @desc    Get current authenticated user's nutrition targets
 * @access  Private (Protected by authMiddleware)
 */
export const getNutritionTarget = async (req, res) => {
  try {
    const nutritionTarget = await NutritionTarget.findOne({ userId: req.userId });

    if (!nutritionTarget) {
      return res.status(200).json({
        success: true,
        nutritionTarget: null,
      });
    }

    return res.status(200).json({
      success: true,
      nutritionTarget,
    });
  } catch (error) {
    console.error('Error fetching nutrition target:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching nutrition target',
    });
  }
};
