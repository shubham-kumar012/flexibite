import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import DietEntryCard from '../components/diet/DietEntryCard';
import EditDietModal from '../components/diet/EditDietModal';
import { getTodayDiet, deleteDietEntry } from '../services/dietService';
import {
  Utensils,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Flame,
  Apple,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

// Helper to format date naturally (e.g. "Monday, August 24")
function getFormattedTodayDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
}

export default function TodaysDiet() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbohydrates: 0, fats: 0, fibre: 0 });
  const [nutritionTarget, setNutritionTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch today's diet logs and nutrition target goals
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');

    try {
      // 1. Fetch user's diet entries logged today
      const dietData = await getTodayDiet();
      if (dietData.success) {
        setEntries(dietData.entries || []);
        setTotals(dietData.totals || { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fibre: 0 });
      }

      // 2. Fetch daily nutrition target goals set in Phase 2
      const targetRes = await fetch(`${APP_CONFIG.apiBaseUrl}/nutrition-targets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const targetData = await targetRes.json();
      if (targetData.success && targetData.nutritionTarget) {
        setNutritionTarget(targetData.nutritionTarget);
      }
    } catch (err) {
      console.error('Error loading today\'s diet:', err);
      setError('Unable to load today\'s diet log. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete handler with instant backend deletion and state update
  const handleDeleteEntry = async (id) => {
    try {
      const res = await deleteDietEntry(id);
      if (res.success) {
        // Refresh today's diet data to update totals accurately
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete diet entry.');
    }
  };

  // Open edit modal for an entry
  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setEditModalOpen(true);
  };

  // Save edit handler
  const handleSaveEditSuccess = () => {
    fetchData();
  };

  // Helper to filter entries by meal type
  const getEntriesForMeal = (mealTypeKey) => {
    return entries.filter((e) => e.mealType === mealTypeKey);
  };

  // Targets fallback
  const targetCalories = nutritionTarget?.calories || 2000;
  const targetProtein = nutritionTarget?.protein || 75;
  const targetCarbs = nutritionTarget?.carbohydrates || 225;
  const targetFat = nutritionTarget?.fat || 50;

  // Calculate percentages for progress bars (clamped to max 100% visually)
  const calPercent = Math.min(100, Math.round((totals.calories / targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((totals.protein / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totals.carbohydrates / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totals.fats / targetFat) * 100));

  const mealSections = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snacks' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-warmBg-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
                Today's Diet
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                <Calendar className="w-3.5 h-3.5" />
                {getFormattedTodayDate()}
              </span>
            </div>
            <p className="text-sm text-charcoal-600 mt-1">
              Track your daily meal intake and stay on target.
            </p>
          </div>

          <Link
            to="/foods"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-soft transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Food</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-warmBg-border p-12 text-center space-y-4 shadow-soft-sm">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-charcoal-700">Loading today's diet...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-8 text-center max-w-md mx-auto space-y-4 shadow-soft-sm">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <div>
              <h3 className="text-base font-bold">Unable to load today's diet</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-soft-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          <>
            {/* Today's Nutrition Progress Summary Card */}
            <div className="bg-white rounded-3xl border border-warmBg-border p-6 sm:p-8 shadow-soft-sm space-y-6">
              <div className="flex items-center justify-between border-b border-warmBg-border pb-4">
                <h2 className="font-display font-extrabold text-lg text-charcoal-900 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-brand-600" />
                  <span>Today's Nutrition</span>
                </h2>
                <div className="flex items-center gap-1 font-black font-display text-xl text-charcoal-900">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>{totals.calories}</span>
                  <span className="text-xs font-bold text-charcoal-500">/ {targetCalories} kcal</span>
                </div>
              </div>

              {/* Calorie Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-charcoal-800">
                  <span>Calories Intake</span>
                  <span>{totals.calories} / {targetCalories} kcal</span>
                </div>
                <div className="w-full bg-warmBg-muted rounded-full h-3 overflow-hidden border border-warmBg-border">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${calPercent}%` }}
                  />
                </div>
              </div>

              {/* Macro Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Protein */}
                <div className="bg-warmBg p-4 rounded-2xl border border-warmBg-border space-y-2">
                  <div className="flex justify-between text-xs font-bold text-charcoal-800">
                    <span className="text-brand-700 font-extrabold">Protein</span>
                    <span>{totals.protein} / {targetProtein}g</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-warmBg-border">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proteinPercent}%` }}
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div className="bg-warmBg p-4 rounded-2xl border border-warmBg-border space-y-2">
                  <div className="flex justify-between text-xs font-bold text-charcoal-800">
                    <span className="text-amber-700 font-extrabold">Carbs</span>
                    <span>{totals.carbohydrates} / {targetCarbs}g</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-warmBg-border">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${carbsPercent}%` }}
                    />
                  </div>
                </div>

                {/* Fat */}
                <div className="bg-warmBg p-4 rounded-2xl border border-warmBg-border space-y-2">
                  <div className="flex justify-between text-xs font-bold text-charcoal-800">
                    <span className="text-rose-700 font-extrabold">Fat</span>
                    <span>{totals.fats} / {targetFat}g</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-warmBg-border">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${fatPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Empty State if 0 entries logged today */}
            {entries.length === 0 ? (
              <div className="bg-white rounded-3xl border border-warmBg-border p-12 text-center max-w-md mx-auto space-y-4 shadow-soft-sm my-6">
                <div className="w-16 h-16 rounded-full bg-warmBg flex items-center justify-center mx-auto text-charcoal-400 border border-warmBg-border">
                  <Utensils className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-charcoal-900">
                    You haven't logged any food today.
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1">
                    Start by adding something from Foods.
                  </p>
                </div>
                <Link
                  to="/foods"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-soft"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Foods</span>
                </Link>
              </div>
            ) : (
              /* Meal Type Sections */
              <div className="space-y-6">
                {mealSections.map((section) => {
                  const mealEntries = getEntriesForMeal(section.key);
                  const mealCalories = mealEntries.reduce((sum, item) => sum + (item.nutrition?.calories || 0), 0);

                  return (
                    <div
                      key={section.key}
                      className="bg-white rounded-3xl border border-warmBg-border p-6 shadow-soft-sm space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-warmBg-border pb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-extrabold text-base text-charcoal-900">
                            {section.label}
                          </h3>
                          {mealEntries.length > 0 && (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              {Math.round(mealCalories)} kcal
                            </span>
                          )}
                        </div>

                        <Link
                          to="/foods"
                          className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add Food</span>
                        </Link>
                      </div>

                      {/* Logged Meal Cards or Empty Meal Placeholder */}
                      {mealEntries.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {mealEntries.map((entry) => (
                            <DietEntryCard
                              key={entry._id}
                              entry={entry}
                              onEdit={handleOpenEdit}
                              onDelete={handleDeleteEntry}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-charcoal-400 font-medium italic py-2">
                          No food added yet
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Edit Diet Modal */}
        <EditDietModal
          entry={editingEntry}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSaveSuccess={handleSaveEditSuccess}
        />
      </div>
    </AppLayout>
  );
}
