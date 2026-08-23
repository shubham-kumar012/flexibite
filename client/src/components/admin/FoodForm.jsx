import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  AlertCircle,
  Check,
  Tag as TagIcon,
  Utensils,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
} from 'lucide-react';
import { uploadAdminFoodImage, deleteAdminFoodImage } from '../../services/foodService';

const PREDEFINED_UNITS = [
  'piece',
  'katori',
  'bowl',
  'cup',
  'glass',
  'plate',
  'slice',
  'tablespoon',
  'teaspoon',
  'other',
];

const PREDEFINED_ALLERGENS = [
  { id: 'milk', label: 'Milk' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts' },
  { id: 'soy', label: 'Soy' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'egg', label: 'Egg' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'other', label: 'Other' },
];

const SUGGESTED_TAGS = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'high-protein',
  'high-fiber',
  'low-calorie',
  'vegetable',
  'dal',
  'rice',
  'bread',
  'vegan',
];

export default function FoodForm({ initialValues, onSubmit, isSubmitting, title = 'Add New Food' }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    dietaryType: 'unknown',
    nutritionPer100g: {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fats: 0,
      freeSugar: 0,
      fibre: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      folate: 0,
    },
    servings: [],
    allergens: [],
    tags: [],
    image: { url: '', key: '' },
    source: { dataset: 'Indian Food Nutrition Dataset', license: '' },
    isActive: true,
  });

  const [customTag, setCustomTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [imageStatusMsg, setImageStatusMsg] = useState('');

  // Populate form if editing existing item
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        category: initialValues.category || '',
        dietaryType: initialValues.dietaryType || 'unknown',
        nutritionPer100g: {
          calories: initialValues.nutritionPer100g?.calories ?? 0,
          carbohydrates: initialValues.nutritionPer100g?.carbohydrates ?? 0,
          protein: initialValues.nutritionPer100g?.protein ?? 0,
          fats: initialValues.nutritionPer100g?.fats ?? 0,
          freeSugar: initialValues.nutritionPer100g?.freeSugar ?? 0,
          fibre: initialValues.nutritionPer100g?.fibre ?? 0,
          sodium: initialValues.nutritionPer100g?.sodium ?? 0,
          calcium: initialValues.nutritionPer100g?.calcium ?? 0,
          iron: initialValues.nutritionPer100g?.iron ?? 0,
          vitaminC: initialValues.nutritionPer100g?.vitaminC ?? 0,
          folate: initialValues.nutritionPer100g?.folate ?? 0,
        },
        servings: initialValues.servings || [],
        allergens: initialValues.allergens || [],
        tags: initialValues.tags || [],
        image: {
          url: initialValues.image?.url || '',
          key: initialValues.image?.key || '',
        },
        source: {
          dataset: initialValues.source?.dataset || 'Indian Food Nutrition Dataset',
          license: initialValues.source?.license || '',
        },
        isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
      });

      if (initialValues.image?.url) {
        setPreviewUrl(initialValues.image.url);
      }
    }
  }, [initialValues]);

  // General field handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Nutrition subfield handler
  const handleNutritionChange = (field, value) => {
    const numVal = value === '' ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      nutritionPer100g: {
        ...prev.nutritionPer100g,
        [field]: isNaN(numVal) ? 0 : numVal,
      },
    }));
  };

  // Serving Handlers
  const addServing = () => {
    setFormData((prev) => ({
      ...prev,
      servings: [...prev.servings, { name: '', unit: 'katori', grams: 100 }],
    }));
  };

  const updateServing = (index, field, value) => {
    setFormData((prev) => {
      const updatedServings = [...prev.servings];
      updatedServings[index] = {
        ...updatedServings[index],
        [field]: field === 'grams' ? (value === '' ? '' : parseFloat(value)) : value,
      };
      return { ...prev, servings: updatedServings };
    });
  };

  const removeServing = (index) => {
    setFormData((prev) => ({
      ...prev,
      servings: prev.servings.filter((_, i) => i !== index),
    }));
  };

  // Allergen Handlers
  const toggleAllergen = (allergenId) => {
    setFormData((prev) => {
      const exists = prev.allergens.includes(allergenId);
      const updated = exists
        ? prev.allergens.filter((item) => item !== allergenId)
        : [...prev.allergens, allergenId];
      return { ...prev, allergens: updated };
    });
  };

  // Tag Handlers
  const toggleTag = (tagName) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tagName);
      const updated = exists
        ? prev.tags.filter((t) => t !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags: updated };
    });
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    const clean = customTag.trim().toLowerCase().replace(/\s+/g, '-');
    if (!formData.tags.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
    }
    setCustomTag('');
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Image Selection Handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageStatusMsg('Error: Selected image exceeds 5 MB limit.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageStatusMsg('Error: Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageStatusMsg(
      initialValues?._id
        ? 'Local image selected. Click "Upload Image" to upload to AWS S3.'
        : 'Local image selected. It will be uploaded automatically when saving.'
    );
  };

  // Upload Image directly (for existing food)
  const handleUploadImage = async () => {
    if (!selectedFile) return;
    if (!initialValues?._id) return;

    setIsUploadingImage(true);
    setImageStatusMsg('Uploading image to AWS S3...');
    try {
      const res = await uploadAdminFoodImage(initialValues._id, selectedFile);
      if (res.food?.image) {
        setFormData((prev) => ({ ...prev, image: res.food.image }));
        setPreviewUrl(res.food.image.url);
        setSelectedFile(null);
        setImageStatusMsg('Image uploaded successfully.');
      }
    } catch (err) {
      setImageStatusMsg(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Remove Image Handler
  const handleRemoveImage = async () => {
    setImageStatusMsg('');
    if (initialValues?._id && (formData.image.key || formData.image.url)) {
      setIsRemovingImage(true);
      try {
        await deleteAdminFoodImage(initialValues._id);
        setFormData((prev) => ({ ...prev, image: { url: '', key: '' } }));
        setPreviewUrl('');
        setSelectedFile(null);
        setImageStatusMsg('Image removed successfully.');
      } catch (err) {
        setImageStatusMsg(err.message || 'Failed to remove image.');
      } finally {
        setIsRemovingImage(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, image: { url: '', key: '' } }));
      setPreviewUrl('');
      setSelectedFile(null);
      setImageStatusMsg('Image removed.');
    }
  };

  // Validation & Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Food Dish Name is required.');
      return;
    }

    if (!formData.category.trim()) {
      setErrorMsg('Category is required.');
      return;
    }

    // Validate nutrition numbers
    for (const [key, val] of Object.entries(formData.nutritionPer100g)) {
      if (typeof val !== 'number' || isNaN(val) || val < 0) {
        setErrorMsg(`Nutrition value for '${key}' must be a non-negative number.`);
        return;
      }
    }

    // Validate serving sizes
    for (let i = 0; i < formData.servings.length; i++) {
      const s = formData.servings[i];
      if (!s.name || !s.name.trim()) {
        setErrorMsg(`Serving #${i + 1} requires a name (e.g. '1 medium katori').`);
        return;
      }
      if (typeof s.grams !== 'number' || isNaN(s.grams) || s.grams <= 0) {
        setErrorMsg(`Serving #${i + 1} grams must be a positive number greater than 0.`);
        return;
      }
    }

    onSubmit(formData, selectedFile);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/foods')}
            className="p-2 rounded-xl text-charcoal-600 hover:bg-warmBg border border-warmBg-border transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-charcoal-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-charcoal-500 font-medium">
              Manage Indian food dish metadata, nutrition per 100g, servings, and S3 images.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider flex items-center gap-2">
            <Utensils className="w-4 h-4 text-brand-600" />
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Food Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aloo Gobhi"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBg-border text-sm font-medium text-charcoal-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Dry Sabzis (Stir-Fries)"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBg-border text-sm font-medium text-charcoal-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Dietary Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="dietaryType"
                value={formData.dietaryType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBg-border text-sm font-medium text-charcoal-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: NUTRITION PER 100G */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
              2. Nutrition Values (Per 100g)
            </h2>
            <p className="text-[11px] text-charcoal-500 font-medium">
              Base reference dataset. Values will automatically scale for custom servings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { key: 'calories', label: 'Calories (kcal)' },
              { key: 'carbohydrates', label: 'Carbohydrates (g)' },
              { key: 'protein', label: 'Protein (g)' },
              { key: 'fats', label: 'Fats (g)' },
              { key: 'freeSugar', label: 'Free Sugar (g)' },
              { key: 'fibre', label: 'Fibre (g)' },
              { key: 'sodium', label: 'Sodium (mg)' },
              { key: 'calcium', label: 'Calcium (mg)' },
              { key: 'iron', label: 'Iron (mg)' },
              { key: 'vitaminC', label: 'Vitamin C (mg)' },
              { key: 'folate', label: 'Folate (µg)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.nutritionPer100g[key]}
                  onChange={(e) => handleNutritionChange(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-warmBg-border text-sm font-medium text-charcoal-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: SERVING SIZES */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
                3. Serving Sizes
              </h2>
              <p className="text-[11px] text-charcoal-500 font-medium">
                Define standard portion estimates (e.g. 1 small katori = 100g).
              </p>
            </div>
            <button
              type="button"
              onClick={addServing}
              className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 hover:bg-brand-100 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Serving</span>
            </button>
          </div>

          {formData.servings.length === 0 ? (
            <div className="p-4 text-center text-xs font-medium text-charcoal-500 rounded-xl bg-warmBg border border-dashed border-warmBg-border">
              No serving sizes defined yet. Click &quot;Add Serving&quot; to configure portions.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.servings.map((serving, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-warmBg border border-warmBg-border flex flex-col sm:flex-row items-center gap-3"
                >
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-0.5">
                      Serving Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 medium katori"
                      value={serving.name}
                      onChange={(e) => updateServing(index, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-warmBg-border text-xs font-medium text-charcoal-900 bg-white"
                    />
                  </div>

                  <div className="w-full sm:w-36">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-0.5">
                      Unit
                    </label>
                    <select
                      value={serving.unit}
                      onChange={(e) => updateServing(index, 'unit', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-warmBg-border text-xs font-medium text-charcoal-900 bg-white"
                    >
                      {PREDEFINED_UNITS.map((unitOption) => (
                        <option key={unitOption} value={unitOption}>
                          {unitOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-28">
                    <label className="block text-[10px] font-bold text-charcoal-500 uppercase mb-0.5">
                      Grams (g)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="150"
                      value={serving.grams}
                      onChange={(e) => updateServing(index, 'grams', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-warmBg-border text-xs font-medium text-charcoal-900 bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeServing(index)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 mt-3 sm:mt-4"
                    title="Remove Serving"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: ALLERGENS */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider">
              4. Allergens
            </h2>
            <p className="text-[11px] text-charcoal-500 font-medium">
              Select common allergens contained in this dish.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PREDEFINED_ALLERGENS.map(({ id, label }) => {
              const isSelected = formData.allergens.includes(id);
              return (
                <label
                  key={id}
                  onClick={() => toggleAllergen(id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50 border-brand-300 text-brand-800'
                      : 'bg-warmBg border-warmBg-border text-charcoal-700 hover:border-charcoal-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-charcoal-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: TAGS */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-brand-600" />
              5. Tags & Classifications
            </h2>
            <p className="text-[11px] text-charcoal-500 font-medium">
              Select suggested tags or add custom tags for filtering and recommendations.
            </p>
          </div>

          {/* Active Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-warmBg rounded-xl border border-warmBg-border">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-white border border-brand-200 text-brand-700 text-xs font-bold flex items-center gap-1.5 shadow-soft-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-charcoal-400 hover:text-rose-600 font-extrabold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggested Pills */}
          <div>
            <span className="block text-[11px] font-bold text-charcoal-500 uppercase mb-2">
              Suggested Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = formData.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-warmBg text-charcoal-700 border border-warmBg-border hover:bg-warmBg-muted'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}#{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add custom tag (e.g. high-calcium)"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-warmBg-border text-xs font-medium text-charcoal-900 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* SECTION 6: FOOD IMAGE (AWS S3) */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-charcoal-900 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-600" />
              6. Food Image (AWS S3)
            </h2>
            <p className="text-[11px] text-charcoal-500 font-medium">
              Upload dish image directly to AWS S3 storage. Manual S3 URL entry is disabled.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 rounded-xl bg-warmBg border border-warmBg-border">
            {/* Image Preview */}
            <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-warmBg-border bg-white flex flex-col items-center justify-center overflow-hidden shrink-0 relative">
              {previewUrl || formData.image.url ? (
                <img
                  src={previewUrl || formData.image.url}
                  alt={formData.name || 'Food preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-3 text-charcoal-400 flex flex-col items-center gap-1">
                  <ImageIcon className="w-8 h-8 stroke-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Select Food Image File
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="block w-full text-xs text-charcoal-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                />
                <p className="text-[10px] text-charcoal-500 mt-1">
                  Allowed formats: JPEG, PNG, WebP (Max size: 5 MB)
                </p>
              </div>

              {/* Status Message */}
              {imageStatusMsg && (
                <div
                  className={`text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2 ${
                    imageStatusMsg.includes('failed') || imageStatusMsg.includes('Error')
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {imageStatusMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {initialValues?._id && selectedFile && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={isUploadingImage}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-soft-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUploadingImage ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>
                )}

                {(formData.image.url || formData.image.key || previewUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isRemovingImage}
                    className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isRemovingImage ? (
                      <span>Removing...</span>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-4 h-4 text-brand-600 rounded border-warmBg-border focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-charcoal-900">
                Active in Food Database (Visible to users)
              </span>
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/foods')}
            className="px-5 py-2.5 rounded-xl border border-warmBg-border text-xs font-bold text-charcoal-700 hover:bg-warmBg transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-soft-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Food Item...' : 'Save Food'}
          </button>
        </div>
      </form>
    </div>
  );
}
