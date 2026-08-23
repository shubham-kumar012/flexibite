import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Utensils, Egg, Flame, PlusCircle } from 'lucide-react';
import ServingModal from './ServingModal';

const DIETARY_CONFIG = {
  vegan: { label: 'Vegan', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Leaf },
  vegetarian: { label: 'Vegetarian', bg: 'bg-green-50 text-green-700 border-green-200', icon: Leaf },
  eggetarian: { label: 'Eggetarian', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Egg },
  non_vegetarian: { label: 'Non-Vegetarian', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Utensils },
  unknown: { label: 'General', bg: 'bg-gray-50 text-gray-600 border-gray-200', icon: Utensils },
};

export default function FoodCard({ food }) {
  const [imageError, setImageError] = useState(false);
  const [servingModalOpen, setServingModalOpen] = useState(false);

  const dietary = DIETARY_CONFIG[food.dietaryType] || DIETARY_CONFIG.unknown;
  const DietaryIcon = dietary.icon;

  const calories = food.nutritionPer100g?.calories ?? 0;
  const protein = food.nutritionPer100g?.protein ?? 0;

  const hasImage = Boolean(food.image?.url && !imageError);

  return (
    <>
      <div className="bg-white rounded-2xl border border-warmBg-border shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col overflow-hidden group">
        {/* Food Image Container with Consistent Aspect Ratio */}
        <div className="relative aspect-[4/3] w-full bg-warmBg-muted overflow-hidden flex items-center justify-center">
          {hasImage ? (
            <img
              src={food.image.url}
              alt={food.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-charcoal-400">
              <Utensils className="w-10 h-10 mb-1 text-charcoal-300" />
              <span className="text-xs font-medium">No Image Available</span>
            </div>
          )}

          {/* Dietary Tag Badge on Top Right */}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${dietary.bg}`}
            >
              <DietaryIcon className="w-3 h-3" />
              {dietary.label}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
              {food.category}
            </span>
            <h3 className="text-sm font-extrabold text-charcoal-900 group-hover:text-brand-700 transition-colors line-clamp-1 mt-0.5">
              {food.name}
            </h3>
          </div>

          {/* Aligned 2-Column Nutrition Box (per 100g) */}
          <div className="bg-warmBg border border-warmBg-border rounded-xl p-2.5 grid grid-cols-2 divide-x divide-warmBg-border text-center">
            <div className="px-1 flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-charcoal-400 tracking-wider">Calories</span>
              <span className="font-extrabold text-xs text-charcoal-900 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {Math.round(calories)} kcal
              </span>
            </div>
            <div className="px-1 flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-charcoal-400 tracking-wider">Protein</span>
              <span className="font-extrabold text-xs text-brand-700 mt-0.5">
                {protein}g <span className="text-[9px] font-normal text-charcoal-400">/ 100g</span>
              </span>
            </div>
          </div>

          {/* Action CTAs: + Add to Diet (Opens Serving Modal) & Details */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setServingModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold text-charcoal-800 bg-warmBg hover:bg-warmBg-muted border border-warmBg-border transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-brand-600" />
              <span>Add</span>
            </button>

            <Link
              to={`/foods/${food._id}`}
              className="w-full inline-flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Serving Selection & Macros Modal */}
      <ServingModal
        food={food}
        isOpen={servingModalOpen}
        onClose={() => setServingModalOpen(false)}
      />
    </>
  );
}
