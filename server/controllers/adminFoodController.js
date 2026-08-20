import Food from '../models/Food.js';
import { createSlug } from '../utils/foodHelpers.js';

/**
 * @route   GET /api/admin/foods
 * @desc    Get all foods with search and pagination for admin
 * @access  Private (Admin Only)
 */
export const getFoods = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const totalFoods = await Food.countDocuments(query);
    const totalPages = Math.ceil(totalFoods / limit) || 1;
    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
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
    console.error('Error fetching admin foods:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch food items',
    });
  }
};

/**
 * @route   GET /api/admin/foods/:id
 * @desc    Get single food item details
 * @access  Private (Admin Only)
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
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

/**
 * @route   POST /api/admin/foods
 * @desc    Create a new food item
 * @access  Private (Admin Only)
 */
export const createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      dietaryType,
      nutritionPer100g,
      servings,
      allergens,
      tags,
      image,
      source,
      isActive,
    } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Food name is required',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const slug = createSlug(name);
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food name for slug generation',
      });
    }

    // Check slug duplication
    const existingFood = await Food.findOne({ slug });
    if (existingFood) {
      return res.status(400).json({
        success: false,
        message: `A food dish with name '${name.trim()}' already exists`,
      });
    }

    const newFood = await Food.create({
      name: name.trim(),
      slug,
      category: category.trim(),
      dietaryType: dietaryType || 'unknown',
      nutritionPer100g: nutritionPer100g || {},
      servings: Array.isArray(servings) ? servings : [],
      allergens: Array.isArray(allergens) ? allergens : [],
      tags: Array.isArray(tags) ? tags : [],
      image: image || { url: '', key: '' },
      source: source || { dataset: 'Indian Food Nutrition Dataset', license: '' },
      isActive: typeof isActive === 'boolean' ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      food: newFood,
    });
  } catch (error) {
    console.error('Error creating food item:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create food item',
    });
  }
};

/**
 * @route   PUT /api/admin/foods/:id
 * @desc    Update existing food item
 * @access  Private (Admin Only)
 */
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    const {
      name,
      category,
      dietaryType,
      nutritionPer100g,
      servings,
      allergens,
      tags,
      image,
      source,
      isActive,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Food name is required',
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const newSlug = createSlug(name);

    // Check slug duplication if name has changed
    if (newSlug !== food.slug) {
      const slugDuplicate = await Food.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });
      if (slugDuplicate) {
        return res.status(400).json({
          success: false,
          message: `A food dish with name '${name.trim()}' already exists`,
        });
      }
      food.slug = newSlug;
    }

    food.name = name.trim();
    food.category = category.trim();
    if (dietaryType) food.dietaryType = dietaryType;
    if (nutritionPer100g) food.nutritionPer100g = nutritionPer100g;
    if (Array.isArray(servings)) food.servings = servings;
    if (Array.isArray(allergens)) food.allergens = allergens;
    if (Array.isArray(tags)) food.tags = tags;
    if (image) food.image = image;
    if (source) food.source = source;
    if (typeof isActive === 'boolean') food.isActive = isActive;

    await food.save();

    return res.status(200).json({
      success: true,
      message: 'Food item updated successfully',
      food,
    });
  } catch (error) {
    console.error('Error updating food item:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update food item',
    });
  }
};

/**
 * @route   PATCH /api/admin/foods/:id/status
 * @desc    Toggle or update active status of a food item
 * @access  Private (Admin Only)
 */
export const updateFoodStatus = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    food.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : !food.isActive;
    await food.save();

    return res.status(200).json({
      success: true,
      message: `Food item ${food.isActive ? 'activated' : 'deactivated'} successfully`,
      food,
    });
  } catch (error) {
    console.error('Error updating food status:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update food status',
    });
  }
};

/**
 * @route   DELETE /api/admin/foods/:id
 * @desc    Delete food item
 * @access  Private (Admin Only)
 */
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Food item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting food item:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete food item',
    });
  }
};
