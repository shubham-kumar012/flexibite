/**
 * Helper utility functions for formatting database values into human-readable strings
 */

/**
 * Format wellness goal into human-readable string
 * @param {string} goal 
 * @returns {string}
 */
export const formatGoal = (goal) => {
  switch (goal) {
    case 'lose_weight':
      return 'Lose Weight';
    case 'maintain_weight':
      return 'Maintain Weight';
    case 'gain_weight':
      return 'Gain Weight';
    default:
      return goal ? String(goal).replace(/_/g, ' ') : 'Not set';
  }
};

/**
 * Format activity level into human-readable string
 * @param {string} level 
 * @returns {string}
 */
export const formatActivityLevel = (level) => {
  switch (level) {
    case 'sedentary':
      return 'Sedentary';
    case 'lightly_active':
      return 'Lightly Active';
    case 'moderately_active':
      return 'Moderately Active';
    case 'very_active':
      return 'Very Active';
    default:
      return level ? String(level).replace(/_/g, ' ') : 'Not set';
  }
};

/**
 * Format dietary preference into human-readable string
 * @param {string} diet 
 * @returns {string}
 */
export const formatDiet = (diet) => {
  switch (diet) {
    case 'vegan':
      return 'Vegan';
    case 'vegetarian':
      return 'Vegetarian';
    case 'eggetarian':
      return 'Eggetarian';
    case 'non_vegetarian':
      return 'Non-Vegetarian';
    default:
      return diet ? String(diet).replace(/_/g, ' ') : 'Not set';
  }
};

/**
 * Format allergies array into human-readable string
 * @param {Array<string>} allergies 
 * @returns {string}
 */
export const formatAllergies = (allergies) => {
  if (!allergies || !Array.isArray(allergies) || allergies.length === 0 || allergies.includes('none')) {
    return 'None';
  }
  return allergies
    .map((a) =>
      String(a)
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    )
    .join(', ');
};

/**
 * Get goal adjustment percentage/description text for calculations
 * @param {string} goal 
 * @returns {string}
 */
export const getGoalAdjustmentLabel = (goal) => {
  switch (goal) {
    case 'lose_weight':
      return '-15% (Deficit)';
    case 'gain_weight':
      return '+10% (Surplus)';
    case 'maintain_weight':
      return '0% (Maintenance)';
    default:
      return '0%';
  }
};

/**
 * Get simple goal explanation text
 * @param {string} goal 
 * @returns {string}
 */
export const getGoalExplanation = (goal) => {
  switch (goal) {
    case 'lose_weight':
      return 'Your target includes a modest calorie deficit to support gradual weight loss.';
    case 'gain_weight':
      return 'Your target includes a modest calorie surplus to support gradual weight gain.';
    case 'maintain_weight':
      return 'Your target is based around your estimated maintenance needs.';
    default:
      return 'Your target is calculated based on your maintenance needs.';
  }
};
