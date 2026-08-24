import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Scale, Flame, PlusCircle, Leaf, Egg, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { addDietEntry } from '../../services/dietService';

const DIETARY_CONFIG = {
  vegan: { label: 'Vegan', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Leaf },
  vegetarian: { label: 'Vegetarian', bg: 'bg-green-50 text-green-700 border-green-200', icon: Leaf },
  eggetarian: { label: 'Eggetarian', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Egg },
  non_vegetarian: { label: 'Non-Vegetarian', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Utensils },
  unknown: { label: 'General', bg: 'bg-gray-50 text-gray-600 border-gray-200', icon: Utensils },
};

const MEAL_OPTIONS = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snacks' },
];

export default function ServingModal({ food, isOpen, onClose, initialMealType = 'lunch' }) {
  const [selectedServing, setSelectedServing] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (food) {
      if (food.servings && food.servings.length > 0) {
        setSelectedServing(food.servings[0]);
      } else {
        setSelectedServing({ name: 'Standard Portion', unit: 'g', grams: 100 });
      }
      setMealType(initialMealType || 'lunch');
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [food, initialMealType]);

  if (!isOpen || !food) return null;

  const dietary = DIETARY_CONFIG[food.dietaryType] || DIETARY_CONFIG.unknown;
  const DietaryIcon = dietary.icon;

  const servingsList = food.servings && food.servings.length > 0
    ? food.servings
    : [{ name: 'Standard Portion', unit: 'g', grams: 100 }];

  const currentGrams = selectedServing?.grams || 100;
  const multiplier = currentGrams / 100;

  const nutrition100g = food.nutritionPer100g || {};
  const estimatedNutrition = {
    calories: Math.round((nutrition100g.calories || 0) * multiplier),
    protein: parseFloat(((nutrition100g.protein || 0) * multiplier).toFixed(1)),
    carbohydrates: parseFloat(((nutrition100g.carbohydrates || 0) * multiplier).toFixed(1)),
    fats: parseFloat(((nutrition100g.fats || 0) * multiplier).toFixed(1)),
    fibre: parseFloat(((nutrition100g.fibre || 0) * multiplier).toFixed(1)),
  };

  const handleAddToDiet = async () => {
    if (!selectedServing) return;
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await addDietEntry({
        foodId: food._id,
        mealType,
        serving: {
          name: selectedServing.name,
          grams: selectedServing.grams,
        },
      });

      if (res.success) {
        const capitalizedMeal = mealType.charAt(0).toUpperCase() + mealType.slice(1);
        setSuccessMessage(`${food.name} added to ${capitalizedMeal}!`);
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1100);
      } else {
        setErrorMessage(res.message || 'Failed to add food');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error adding food to diet');
    } finally {
      setSubmitting(false);
    }
  };

  // Render modal directly to document.body using React Portal for full screen backdrop coverage
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-floating border border-warmBg-border space-y-5 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-warmBg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header / Food Info */}
        <div className="flex items-center gap-4 border-b border-warmBg-border pb-4 pr-8">
          <div className="w-16 h-16 rounded-2xl bg-warmBg-muted overflow-hidden shrink-0 border border-warmBg-border">
            {food.image?.url ? (
              <img
                src={food.image.url}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                <Utensils className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full uppercase">
                {food.category}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${dietary.bg}`}>
                <DietaryIcon className="w-3 h-3" />
                {dietary.label}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-charcoal-900 line-clamp-1">
              {food.name}
            </h3>
          </div>
        </div>

        {/* Success / Error Feedback Banners */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Serving Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-700">
            <Scale className="w-4 h-4 text-brand-600" />
            <span>Select Serving Size:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {servingsList.map((serving, idx) => {
              const isSelected = selectedServing?.name === serving.name && selectedServing?.grams === serving.grams;
              return (
                <button
                  key={`${serving.name}-${idx}`}
                  type="button"
                  onClick={() => setSelectedServing(serving)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-soft-sm'
                      : 'bg-warmBg border-warmBg-border hover:bg-white hover:border-brand-300'
                  }`}
                >
                  <div>
                    <span className={`block text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-charcoal-800'}`}>
                      {serving.name}
                    </span>
                    <span className="text-[11px] font-medium text-charcoal-500">
                      {serving.grams}g
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-600 bg-brand-600' : 'border-charcoal-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Meal Type Selection */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-charcoal-800 uppercase tracking-wider block">
            Which meal?
          </span>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_OPTIONS.map((m) => {
              const isSelected = mealType === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMealType(m.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-soft-sm'
                      : 'bg-warmBg text-charcoal-700 border-warmBg-border hover:bg-white'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Estimated Macros Preview */}
        <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-brand-800 uppercase tracking-wider">
              Estimated Macros ({selectedServing?.name || '100g'})
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-base text-amber-700">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{estimatedNutrition.calories} kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-brand-200/80">
              <span className="block text-[10px] text-charcoal-500 font-semibold">Protein</span>
              <span className="block font-extrabold text-brand-700 mt-0.5">{estimatedNutrition.protein}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-brand-200/80">
              <span className="block text-[10px] text-charcoal-500 font-semibold">Carbs</span>
              <span className="block font-extrabold text-amber-700 mt-0.5">{estimatedNutrition.carbohydrates}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-brand-200/80">
              <span className="block text-[10px] text-charcoal-500 font-semibold">Fat</span>
              <span className="block font-extrabold text-rose-700 mt-0.5">{estimatedNutrition.fats}g</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-brand-200/80">
              <span className="block text-[10px] text-charcoal-500 font-semibold">Fibre</span>
              <span className="block font-extrabold text-emerald-700 mt-0.5">{estimatedNutrition.fibre}g</span>
            </div>
          </div>
        </div>

        {/* Action Button: Add to Today's Diet */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleAddToDiet}
            disabled={submitting || Boolean(successMessage)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white border border-brand-700 transition-colors flex items-center justify-center gap-2 shadow-soft disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? 'Adding to Diet...' : "Add to Today's Diet"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
