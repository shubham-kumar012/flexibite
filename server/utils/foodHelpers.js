import fs from 'fs';
import path from 'path';

/**
 * Cleans a value and converts it safely to a Number.
 * Removes markdown symbols like '*', commas, and leading/trailing whitespace.
 * Returns 0 if the value is invalid or NaN.
 *
 * @param {any} value
 * @returns {number}
 */
export const cleanNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  // Convert to string and strip unwanted characters like asterisks, commas
  const cleanStr = String(value).replace(/[*,\s]/g, '').trim();
  if (cleanStr === '') {
    return 0;
  }
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Normalizes a food name into a URL-friendly, lowercase slug.
 * Example: "Aloo gobhi" -> "aloo-gobhi"
 *
 * @param {string} name
 * @returns {string}
 */
export const createSlug = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Verifies if a local image exists for the given food slug.
 * Expected path: <foodsDirectory>/<slug>.webp
 *
 * @param {string} slug
 * @param {string} foodsDirectory
 * @returns {boolean}
 */
export const checkImageExists = (slug, foodsDirectory) => {
  if (!slug || !foodsDirectory) return false;

  // Direct file path check for <foodsDirectory>/<slug>.webp
  const directPath = path.join(foodsDirectory, `${slug}.webp`);
  if (fs.existsSync(directPath)) return true;

  // Check for other supported image extensions: <foodsDirectory>/<slug>.<ext>
  const extensions = ['.jpg', '.jpeg', '.png'];
  for (const ext of extensions) {
    if (fs.existsSync(path.join(foodsDirectory, `${slug}${ext}`))) {
      return true;
    }
  }

  // Legacy fallback: <foodsDirectory>/<slug>/image.webp
  const legacyImagePath = path.join(foodsDirectory, slug, 'image.webp');
  if (fs.existsSync(legacyImagePath)) return true;

  // Legacy folder fallback: check inside <foodsDirectory>/<slug>/
  const folderPath = path.join(foodsDirectory, slug);
  if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    return files.some((f) => /\.(webp|jpg|jpeg|png)$/i.test(f));
  }

  return false;
};

/**
 * Parses raw CSV content text into an array of row objects.
 * Handles quoted fields and CRLF/LF line endings.
 *
 * @param {string} csvText
 * @returns {Array<Object>}
 */
export const parseCSV = (csvText) => {
  if (!csvText || typeof csvText !== 'string') return [];

  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, idx) => {
      // Remove UTF-8 Byte Order Mark (\uFEFF) if present and trim header
      const cleanHeaderKey = header.replace(/^\uFEFF/, '').trim();
      row[cleanHeaderKey] = values[idx] !== undefined ? values[idx].trim() : '';
    });
    records.push(row);
  }

  return records;
};

/**
 * Helper to parse a single CSV line respecting double quotes
 *
 * @param {string} line
 * @returns {Array<string>}
 */
const parseCSVLine = (line) => {
  const result = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  result.push(currentVal.trim());
  return result;
};

/**
 * Maps a parsed CSV row object to the structured Food document object.
 * Finds column values dynamically to handle unit symbols safely.
 *
 * @param {Object} row
 * @returns {Object}
 */
export const mapFoodRow = (row) => {
  // Helper to find column value by prefix match case-insensitively
  const getValueByPrefix = (prefix) => {
    const key = Object.keys(row).find((k) =>
      k.toLowerCase().startsWith(prefix.toLowerCase())
    );
    return key ? row[key] : undefined;
  };

  const name = (getValueByPrefix('Dish Name') || getValueByPrefix('Dish') || getValueByPrefix('Name') || '').trim();
  const category = (getValueByPrefix('Category') || '').trim();

  const calories = cleanNumber(getValueByPrefix('Calories'));
  const carbohydrates = cleanNumber(getValueByPrefix('Carbohydrates'));
  const protein = cleanNumber(getValueByPrefix('Protein'));
  const fats = cleanNumber(getValueByPrefix('Fats'));
  const freeSugar = cleanNumber(getValueByPrefix('Free Sugar'));
  const fibre = cleanNumber(getValueByPrefix('Fibre') || getValueByPrefix('Fiber'));
  const sodium = cleanNumber(getValueByPrefix('Sodium'));
  const calcium = cleanNumber(getValueByPrefix('Calcium'));
  const iron = cleanNumber(getValueByPrefix('Iron'));
  const vitaminC = cleanNumber(getValueByPrefix('Vitamin C'));
  const folate = cleanNumber(getValueByPrefix('Folate'));

  const slug = createSlug(name);

  return {
    name,
    slug,
    category,
    dietaryType: 'unknown',
    nutritionPer100g: {
      calories,
      carbohydrates,
      protein,
      fats,
      freeSugar,
      fibre,
      sodium,
      calcium,
      iron,
      vitaminC,
      folate,
    },
    servings: [],
    allergens: [],
    tags: [],
    image: {
      url: '',
      key: '',
    },
    source: {
      dataset: 'Indian Food Nutrition Dataset',
      license: '',
    },
    isActive: true,
  };
};
