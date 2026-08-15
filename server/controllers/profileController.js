import Profile from '../models/Profile.js';

/**
 * @route   POST /api/profile
 * @desc    Create or update current authenticated user's profile
 * @access  Private (Protected by authMiddleware)
 */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      goal,
      targetWeight,
      dietaryPreference,
      allergies,
      dislikedFoods,
    } = req.body;

    // 1. Strict server-side validation
    if (!age || typeof age !== 'number' || age <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid age greater than 0',
      });
    }

    if (!height || !height.value || typeof height.value !== 'number' || height.value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid height in cm greater than 0',
      });
    }

    if (!weight || !weight.value || typeof weight.value !== 'number' || weight.value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid weight in kg greater than 0',
      });
    }

    const validGoals = ['lose_weight', 'maintain_weight', 'gain_weight'];
    if (!goal || !validGoals.includes(goal)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid nutrition goal',
      });
    }

    if ((goal === 'lose_weight' || goal === 'gain_weight')) {
      if (!targetWeight || !targetWeight.value || typeof targetWeight.value !== 'number' || targetWeight.value <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Target weight is required for weight loss or weight gain goals',
        });
      }
    }

    const validDiets = ['vegan', 'vegetarian', 'eggetarian', 'non_vegetarian'];
    if (!dietaryPreference || !validDiets.includes(dietaryPreference)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid dietary preference',
      });
    }

    // 2. Prepare profile object (ensure userId comes strictly from req.userId, not req.body)
    const profileFields = {
      userId: req.userId,
      age,
      gender: ['male', 'female', 'other', 'prefer_not_to_say'].includes(gender) ? gender : 'prefer_not_to_say',
      height: {
        value: height.value,
        unit: 'cm',
      },
      weight: {
        value: weight.value,
        unit: 'kg',
      },
      goal,
      targetWeight: targetWeight && targetWeight.value ? {
        value: targetWeight.value,
        unit: 'kg',
      } : undefined,
      dietaryPreference,
      allergies: Array.isArray(allergies) ? allergies.map(a => String(a).trim()).filter(Boolean) : [],
      dislikedFoods: Array.isArray(dislikedFoods) ? dislikedFoods.map(f => String(f).trim()).filter(Boolean) : [],
      onboardingCompleted: true,
    };

    // 3. Upsert profile (Update existing profile or create one if it doesn't exist)
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { $set: profileFields },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      profile,
    });
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error saving profile',
    });
  }
};

/**
 * @route   GET /api/profile
 * @desc    Get current authenticated user's profile and completion status
 * @access  Private (Protected by authMiddleware)
 */
export const getProfile = async (req, res) => {
  try {
    // req.userId comes from authMiddleware
    const profile = await Profile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        profileCompleted: false,
        profile: null,
      });
    }

    return res.status(200).json({
      success: true,
      profileCompleted: profile.onboardingCompleted,
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};
