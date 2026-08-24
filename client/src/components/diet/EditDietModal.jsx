import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Scale, Utensils, Save } from 'lucide-react';
import { updateDietEntry } from '../../services/dietService';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

export default function EditDietModal({ entry, isOpen, onClose, onSaveSuccess }) {
  const [mealType, setMealType] = useState('lunch');
  const [selectedServing, setSelectedServing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entry) {
      setMealType(entry.mealType || 'lunch');
      setSelectedServing(entry.serving || null);
      setError('');
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const food = entry.foodId || {};
  const availableServings = food.servings && food.servings.length > 0
    ? food.servings
    : [{ name: 'Standard Portion', unit: 'g', grams: 100 }];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServing) {
      setError('Please select a serving size.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await updateDietEntry(entry._id, {
        mealType,
        serving: {
          name: selectedServing.name,
          grams: selectedServing.grams,
        },
      });

      if (res.success) {
        onSaveSuccess(res.entry);
        onClose();
      } else {
        setError(res.message || 'Failed to update entry.');
      }
    } catch (err) {
      setError(err.message || 'Error updating diet entry.');
    } finally {
      setSaving(false);
    }
  };

  // Using React Portal to attach directly to document.body.
  // This guarantees the backdrop inset-0 covers 100% of the screen without top-bar clipping.
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-floating border border-warmBg-border space-y-5 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-warmBg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-warmBg-border pr-8">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Edit Logged Meal
            </h3>
            <p className="text-xs text-charcoal-500 font-medium">
              {food.name}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meal Type Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              Which meal?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MEAL_TYPES.map((m) => {
                const isSelected = mealType === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMealType(m.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
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

          {/* Serving Size Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-brand-600" />
              <span>Select Serving Size</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableServings.map((serving, idx) => {
                const isSelected = selectedServing?.name === serving.name && selectedServing?.grams === serving.grams;
                return (
                  <button
                    key={`${serving.name}-${idx}`}
                    type="button"
                    onClick={() => setSelectedServing(serving)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20'
                        : 'bg-warmBg border-warmBg-border hover:bg-white'
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

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center justify-center gap-2 shadow-soft"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
