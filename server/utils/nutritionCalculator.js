/**
 * Nutrition Calculator Utility
 * Implements Mifflin-St Jeor equation and standard macro distribution algorithms.
 */

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation:
 * Male: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Female: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 * Other / Prefer not to say: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 78 (neutral midpoint offset)
 *
 * @param {Object} profile - User profile containing age, gender, height ({value}), weight ({value})
 * @returns {number} BMR in kcal (rounded to nearest integer)
 */
export const calculateBMR = (profile) => {
  const { age, gender, height, weight } = profile;
  const weightKg = weight?.value;
  const heightCm = height?.value;

  if (!age || !heightCm || !weightKg) {
    throw new Error('Age, height, and weight are required to calculate BMR.');
  }

  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;

  let genderOffset = -78; // Neutral default for 'other' / 'prefer_not_to_say' (average of male +5 and female -161)
  if (gender === 'male') {
    genderOffset = 5;
  } else if (gender === 'female') {
    genderOffset = -161;
  }

  return Math.round(baseBMR + genderOffset);
};

/**
 * Get activity multiplier for TDEE calculation:
 * sedentary: 1.2
 * lightly_active: 1.375
 * moderately_active: 1.55
 * very_active: 1.725
 *
 * @param {string} activityLevel
 * @returns {number} multiplier
 */
export const getActivityMultiplier = (activityLevel) => {
  switch (activityLevel) {
    case 'sedentary':
      return 1.2;
    case 'lightly_active':
      return 1.375;
    case 'moderately_active':
      return 1.55;
    case 'very_active':
      return 1.725;
    default:
      return 1.2;
  }
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE):
 * TDEE = BMR × Activity Multiplier
 *
 * @param {number} bmr
 * @param {string} activityLevel
 * @returns {number} TDEE in kcal (rounded to nearest integer)
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
};

/**
 * Calculate goal-adjusted daily calorie target:
 * lose_weight: TDEE × 0.85 (~15% deficit)
 * maintain_weight: TDEE
 * gain_weight: TDEE × 1.10 (~10% surplus)
 *
 * @param {number} tdee
 * @param {string} goal
 * @returns {number} Target calories in kcal (rounded to nearest integer)
 */
export const calculateCalorieTarget = (tdee, goal) => {
  let factor = 1.0;
  if (goal === 'lose_weight') {
    factor = 0.85;
  } else if (goal === 'gain_weight') {
    factor = 1.10;
  }
  return Math.round(tdee * factor);
};

/**
 * Calculate macronutrient distribution in grams:
 * - Protein: 1.6g per kg of body weight
 * - Fat: 25% of total calorie target (fat = calories × 0.25 / 9)
 * - Carbohydrates: Remaining calories after protein and fat (carbs = remaining_calories / 4)
 *
 * @param {number} calories - Target daily calories
 * @param {number} weightKg - Body weight in kg
 * @returns {Object} { protein, fat, carbohydrates } in grams (rounded integers)
 */
export const calculateMacros = (calories, weightKg) => {
  if (!calories || !weightKg) {
    throw new Error('Calories and weight are required to calculate macros.');
  }

  // Protein: 1.6g per kg body weight
  const proteinGrams = Math.round(1.6 * weightKg);
  const proteinCalories = proteinGrams * 4;

  // Fat: 25% of target calories (9 kcal/g)
  const fatCalories = calories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  const actualFatCalories = fatGrams * 9;

  // Carbohydrates: Remaining calories after protein and fat (4 kcal/g)
  const remainingCalories = Math.max(0, calories - proteinCalories - actualFatCalories);
  const carbGrams = Math.round(remainingCalories / 4);

  return {
    protein: proteinGrams,
    fat: fatGrams,
    carbohydrates: carbGrams,
  };
};

/**
 * Full Nutrition Target Calculation combining all helper steps
 *
 * @param {Object} profile - User profile object
 * @returns {Object} Complete nutrition target data
 */
export const calculateNutritionTargets = (profile) => {
  const bmr = calculateBMR(profile);
  const activityMultiplier = getActivityMultiplier(profile.activityLevel);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calories = calculateCalorieTarget(tdee, profile.goal);
  const macros = calculateMacros(calories, profile.weight?.value || 60);

  return {
    bmr,
    activityMultiplier,
    tdee,
    calories,
    protein: macros.protein,
    fat: macros.fat,
    carbohydrates: macros.carbohydrates,
  };
};
