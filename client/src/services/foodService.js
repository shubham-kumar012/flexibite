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
 * Fetch paginated & searchable food list for admin.
 */
export const getAdminFoods = async ({ page = 1, limit = 20, search = '' } = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    queryParams.append('search', search);
  }

  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch foods');
  }
  return data;
};

/**
 * Fetch a single food item by ID.
 */
export const getAdminFoodById = async (id) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch food details');
  }
  return data;
};

/**
 * Create a new food item.
 */
export const createAdminFood = async (foodData) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create food item');
  }
  return data;
};

/**
 * Update an existing food item.
 */
export const updateAdminFood = async (id, foodData) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update food item');
  }
  return data;
};

/**
 * Toggle active status of a food item.
 */
export const updateFoodStatus = async (id, isActive) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update food status');
  }
  return data;
};

/**
 * Delete a food item by ID.
 */
export const deleteAdminFood = async (id) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete food item');
  }
  return data;
};

/**
 * Upload an image file for a food item to AWS S3.
 */
export const uploadAdminFoodImage = async (id, file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}/image`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload food image');
  }
  return data;
};

/**
 * Delete image for a food item from AWS S3.
 */
export const deleteAdminFoodImage = async (id) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/admin/foods/${id}/image`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove food image');
  }
  return data;
};

/* ==========================================================================
   PUBLIC / USER FOOD DISCOVERY API SERVICES
   ========================================================================== */

/**
 * Fetch paginated, searchable, and filtered active food list for normal users.
 */
export const getPublicFoods = async ({
  page = 1,
  limit = 20,
  search = '',
  category = '',
  dietaryType = '',
} = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) queryParams.append('search', search);
  if (category) queryParams.append('category', category);
  if (dietaryType) queryParams.append('dietaryType', dietaryType);

  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/foods?${queryParams.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch foods');
  }
  return data;
};

/**
 * Fetch distinct active categories for normal users.
 */
export const getPublicCategories = async () => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/foods/categories`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch categories');
  }
  return data;
};

/**
 * Fetch details for a single food item by ID for normal users.
 */
export const getPublicFoodById = async (id) => {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}/foods/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch food details');
  }
  return data;
};
