import { APP_CONFIG } from '../config/appConfig';

/**
 * Returns authorization header object with stored JWT token.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * Add a food item to today's diet log.
 * @param {Object} payload { foodId, mealType, serving: { name, grams } }
 */
export const addDietEntry = async ({ foodId, mealType, serving }) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/diet`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ foodId, mealType, serving }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add food to diet');
  }
  return data;
};

/**
 * Fetch today's diet entries and daily nutrition totals for authenticated user.
 */
export const getTodayDiet = async () => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/diet/today`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch today\'s diet');
  }
  return data;
};

/**
 * Update an existing diet entry (mealType or serving size).
 * @param {string} id DietEntry ID
 * @param {Object} payload { mealType, serving: { name, grams } }
 */
export const updateDietEntry = async (id, { mealType, serving }) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/diet/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ mealType, serving }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update diet entry');
  }
  return data;
};

/**
 * Delete a diet entry by ID.
 * @param {string} id DietEntry ID
 */
export const deleteDietEntry = async (id) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/diet/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete diet entry');
  }
  return data;
};
