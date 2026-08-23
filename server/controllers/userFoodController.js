import Food from '../models/Food.js';

/**
 * @route   GET /api/foods
 * @desc    Get active foods with pagination, search, category, and dietary type filters
 * @access  Private (Authenticated Users)
 */
export const getFoods = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const search = req.query.search ? req.query.search.trim() : '';
    const category = req.query.category ? req.query.category.trim() : '';
    const dietaryType = req.query.dietaryType ? req.query.dietaryType.trim() : '';

    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (dietaryType) {
      query.dietaryType = dietaryType;
    }

    const totalFoods = await Food.countDocuments(query);
    const totalPages = Math.ceil(totalFoods / limit) || 1;
    const foods = await Food.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      foods,
      currentPage: page,
      totalPages,
      totalFoods,
    });
  } catch (error) {
    console.error('Error fetching public foods:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch foods',
    });
  }
};

/**
 * @route   GET /api/foods/categories
 * @desc    Get distinct categories available across active foods
 * @access  Private (Authenticated Users)
 */
export const getFoodCategories = async (req, res) => {
  try {
    const categories = await Food.distinct('category', { isActive: true });
    return res.status(200).json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    console.error('Error fetching food categories:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

/**
 * @route   GET /api/foods/:id
 * @desc    Get single food item details for normal users
 * @access  Private (Authenticated Users)
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.id, isActive: true });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.error('Error fetching food details:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food details',
    });
  }
};
