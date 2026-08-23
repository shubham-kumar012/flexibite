import React, { useState, useEffect } from 'react';
import { X, Scale, Flame, PlusCircle, Leaf, Egg, Utensils } from 'lucide-react';

const DIETARY_CONFIG = {
  vegan: { label: 'Vegan', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Leaf },
  vegetarian: { label: 'Vegetarian', bg: 'bg-green-50 text-green-700 border-green-200', icon: Leaf },
  eggetarian: { label: 'Eggetarian', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Egg },
  non_vegetarian: { label: 'Non-Vegetarian', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Utensils },
  unknown: { label: 'General', bg: 'bg-gray-50 text-gray-600 border-gray-200', icon: Utensils },
};

export default function ServingModal({ food, isOpen, onClose }) {
  const [selectedServing, setSelectedServing] = useState(null);

  useEffect(() => {
    if (food) {
      if (food.servings && food.servings.length > 0) {
        setSelectedServing(food.servings[0]);
      } else {
        setSelectedServing({ name: 'Standard Portion', unit: 'g', grams: 100 });
      }
    }
  }, [food]);

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

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
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

        {/* Serving Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-700">
            <Scale className="w-4 h-4 text-brand-600" />
            <span>Select Serving Size:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
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

        {/* Action Button (Placeholder disabled for Phase 5.1) */}
        <div className="pt-2">
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-charcoal-100 text-charcoal-400 border border-charcoal-200 cursor-not-allowed flex items-center justify-center gap-2 opacity-80"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to Today's Diet</span>
            <span className="text-[10px] bg-charcoal-200 text-charcoal-700 px-2 py-0.5 rounded-full font-bold uppercase ml-1">
              Coming Soon
            </span>
          </button>
          <p className="text-[10px] text-center text-charcoal-400 font-medium mt-2">
            Food logging will be fully functional in Phase 5.2.
          </p>
        </div>
      </div>
    </div>
  );
}
