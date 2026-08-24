import React from 'react';
import { Flame, Edit3, Trash2, Utensils } from 'lucide-react';

/**
 * Reusable card displaying an individual logged food item in Today's Diet page.
 */
export default function DietEntryCard({ entry, onEdit, onDelete }) {
  const food = entry.foodId || {};
  const serving = entry.serving || {};
  const nutrition = entry.nutrition || {};

  return (
    <div className="bg-white rounded-2xl border border-warmBg-border p-4 shadow-soft-sm hover:shadow-soft transition-all space-y-3">
      {/* Upper Row: Dish Image, Name & Serving Name */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-warmBg-muted overflow-hidden shrink-0 border border-warmBg-border flex items-center justify-center">
            {food.image?.url ? (
              <img
                src={food.image.url}
                alt={food.name || 'Food item'}
                className="w-full h-full object-cover"
              />
            ) : (
              <Utensils className="w-5 h-5 text-charcoal-400" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 uppercase">
              {serving.name} ({serving.grams}g)
            </span>
            <h4 className="text-sm font-extrabold text-charcoal-900 line-clamp-1 mt-1">
              {food.name || 'Unknown Food'}
            </h4>
          </div>
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-brand-700 hover:bg-brand-50 transition-colors"
            title="Edit portion or meal"
            aria-label="Edit entry"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Remove from diet"
            aria-label="Delete entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nutrition Breakdown Snapshot Grid */}
      <div className="bg-warmBg rounded-xl p-2.5 border border-warmBg-border grid grid-cols-4 gap-1 text-center text-xs">
        <div>
          <span className="block text-[9px] uppercase font-bold text-charcoal-400">Calories</span>
          <span className="font-extrabold text-charcoal-900 flex items-center justify-center gap-0.5 mt-0.5">
            <Flame className="w-3 h-3 text-amber-500 shrink-0" />
            {nutrition.calories} <span className="text-[9px] font-normal">kcal</span>
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase font-bold text-charcoal-400">Protein</span>
          <span className="font-extrabold text-brand-700 mt-0.5">{nutrition.protein}g</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase font-bold text-charcoal-400">Carbs</span>
          <span className="font-extrabold text-amber-700 mt-0.5">{nutrition.carbohydrates}g</span>
        </div>
        <div>
          <span className="block text-[9px] uppercase font-bold text-charcoal-400">Fat</span>
          <span className="font-extrabold text-rose-700 mt-0.5">{nutrition.fats}g</span>
        </div>
      </div>
    </div>
  );
}
