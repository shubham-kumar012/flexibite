import React from 'react';
import { Filter, RotateCcw, Leaf } from 'lucide-react';

const DIETARY_OPTIONS = [
  { value: '', label: 'All Diets' },
  { value: 'vegan', label: 'Vegan', isPlant: true },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
];

export default function FoodFilters({
  categories = [],
  selectedCategory = '',
  onSelectCategory,
  selectedDietaryType = '',
  onSelectDietaryType,
  onResetFilters,
  hasActiveFilters = false,
}) {
  return (
    <div className="space-y-4 bg-white p-4 sm:p-5 rounded-2xl border border-warmBg-border shadow-soft-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-charcoal-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filter Foods</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Dietary Type Filter */}
      <div>
        <label className="block text-xs font-semibold text-charcoal-500 mb-2">
          Dietary Type
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((diet) => {
            const isSelected = selectedDietaryType === diet.value;
            return (
              <button
                key={diet.value}
                onClick={() => onSelectDietaryType(diet.value)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-warmBg text-charcoal-700 border border-warmBg-border hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {diet.isPlant && <Leaf className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`} />}
                <span>{diet.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-charcoal-500 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            <button
              onClick={() => onSelectCategory('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === ''
                  ? 'bg-brand-100 text-brand-800 border border-brand-300 font-bold'
                  : 'bg-warmBg text-charcoal-600 border border-warmBg-border hover:bg-white hover:text-charcoal-900'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-100 text-brand-800 border border-brand-300 font-bold'
                      : 'bg-warmBg text-charcoal-600 border border-warmBg-border hover:bg-white hover:text-charcoal-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
