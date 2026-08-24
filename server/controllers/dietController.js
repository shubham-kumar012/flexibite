import DietEntry from '../models/DietEntry.js';
import Food from '../models/Food.js';

// Helper function to calculate nutrition for a specific serving size.
// All master food nutrition values in the database are stored per 100g.
function calculateServingNutrition(food, grams) {
  const multiplier = grams / 100;
  const n100 = food.nutritionPer100g || {};

  return {
    calories: Math.round((n100.calories || 0) * multiplier),
    protein: parseFloat(((n100.protein || 0) * multiplier).toFixed(2)),
    carbohydrates: parseFloat(((n100.carbohydrates || 0) * multiplier).toFixed(2)),
    fats: parseFloat(((n100.fats || 0) * multiplier).toFixed(2)),
    fibre: parseFloat(((n100.fibre || 0) * multiplier).toFixed(2)),
  };
}

// Helper function to get local start and end of current day for querying today's entries.
function getTodayDateRange() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

/**
 * @route   POST /api/diet
 * @desc    Add a food item to today's diet log
 * @access  Private (Protected by authMiddleware)
 */
export const addDietEntry = async (req, res) => {
  try {
    const { foodId, mealType, serving } = req.body;

    // 1. Basic validation of required request body fields
    if (!foodId || !mealType || !serving || !serving.name || !serving.grams) {
      return res.status(400).json({
        success: false,
        message: 'Please provide foodId, valid mealType, and serving details (name and grams).',
      });
    }

    if (serving.grams <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Serving grams must be greater than 0.',
      });
    }

    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const normalizedMealType = String(mealType).toLowerCase().trim();

    if (!validMealTypes.includes(normalizedMealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type. Allowed values: breakfast, lunch, dinner, snack.',
      });
    }

    // 2. Fetch food document from database to verify active status
    const food = await Food.findOne({ _id: foodId, isActive: true });
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found or is inactive.',
      });
    }

    // 3. Always recalculate nutrition on the backend using master Food values to prevent client manipulation
    const nutrition = calculateServingNutrition(food, serving.grams);

    // 4. Save diet entry linked to authenticated user (req.userId set by JWT middleware)
    const dietEntry = new DietEntry({
      userId: req.userId,
      foodId: food._id,
      date: new Date(),
      mealType: normalizedMealType,
      serving: {
        name: serving.name,
        grams: Number(serving.grams),
      },
      nutrition,
    });

    await dietEntry.save();

    // Populate food info for instant frontend UI rendering
    await dietEntry.populate('foodId', 'name category image dietaryType servings');

    return res.status(201).json({
      success: true,
      message: `${food.name} added to ${normalizedMealType}`,
      entry: dietEntry,
    });
  } catch (error) {
    console.error('Error adding diet entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while logging food entry.',
    });
  }
};

/**
 * @route   GET /api/diet/today
 * @desc    Get authenticated user's logged entries and daily totals for today
 * @access  Private (Protected by authMiddleware)
 */
export const getTodayDiet = async (req, res) => {
  try {
    const { startOfDay, endOfDay } = getTodayDateRange();

    // Fetch entries logged today for the authenticated user only
    const entries = await DietEntry.find({
      userId: req.userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('foodId', 'name category image dietaryType servings')
      .sort({ createdAt: 1 });

    // Calculate total daily calories and macros from logged entries
    const totals = entries.reduce(
      (acc, entry) => {
        acc.calories += entry.nutrition?.calories || 0;
        acc.protein += entry.nutrition?.protein || 0;
        acc.carbohydrates += entry.nutrition?.carbohydrates || 0;
        acc.fats += entry.nutrition?.fats || 0;
        acc.fibre += entry.nutrition?.fibre || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fibre: 0 }
    );

    // Round daily totals cleanly for frontend display
    const formattedTotals = {
      calories: Math.round(totals.calories),
      protein: parseFloat(totals.protein.toFixed(1)),
      carbohydrates: parseFloat(totals.carbohydrates.toFixed(1)),
      fats: parseFloat(totals.fats.toFixed(1)),
      fibre: parseFloat(totals.fibre.toFixed(1)),
    };

    return res.status(200).json({
      success: true,
      entries,
      totals: formattedTotals,
    });
  } catch (error) {
    console.error('Error fetching today\'s diet:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching today\'s diet.',
    });
  }
};

/**
 * @route   PUT /api/diet/:id
 * @desc    Update serving or meal type of an existing diet entry owned by user
 * @access  Private (Protected by authMiddleware)
 */
export const updateDietEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { mealType, serving } = req.body;

    // Verify ownership: users can only update their own records
    const entry = await DietEntry.findOne({ _id: id, userId: req.userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Diet entry not found or unauthorized access.',
      });
    }

    if (mealType) {
      const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
      const normalizedMealType = String(mealType).toLowerCase().trim();
      if (!validMealTypes.includes(normalizedMealType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid meal type.',
        });
      }
      entry.mealType = normalizedMealType;
    }

    if (serving && serving.name && serving.grams) {
      if (serving.grams <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Serving grams must be greater than 0.',
        });
      }

      // Re-fetch original food item to recalculate nutrition snapshot for the updated serving size
      const food = await Food.findById(entry.foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Associated food item no longer exists.',
        });
      }

      entry.serving = {
        name: serving.name,
        grams: Number(serving.grams),
      };
      entry.nutrition = calculateServingNutrition(food, serving.grams);
    }

    await entry.save();
    await entry.populate('foodId', 'name category image dietaryType servings');

    return res.status(200).json({
      success: true,
      message: 'Diet entry updated successfully',
      entry,
    });
  } catch (error) {
    console.error('Error updating diet entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating diet entry.',
    });
  }
};

/**
 * @route   DELETE /api/diet/:id
 * @desc    Delete a diet entry owned by authenticated user
 * @access  Private (Protected by authMiddleware)
 */
export const deleteDietEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Ownership check: ensure user can only delete their own diet record
    const entry = await DietEntry.findOneAndDelete({ _id: id, userId: req.userId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Diet entry not found or unauthorized access.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Diet entry deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting diet entry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting diet entry.',
    });
  }
};
