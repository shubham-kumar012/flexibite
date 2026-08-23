import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import FoodCard from '../components/foods/FoodCard';
import FoodSearch from '../components/foods/FoodSearch';
import FoodFilters from '../components/foods/FoodFilters';
import { getPublicFoods, getPublicCategories } from '../services/foodService';
import { ChevronLeft, ChevronRight, Utensils, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFoods, setTotalFoods] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [dietaryType, setDietaryType] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch distinct categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getPublicCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch foods whenever filters or page changes
  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicFoods({
        page: currentPage,
        limit: 20,
        search,
        category,
        dietaryType,
      });

      if (res.success) {
        setFoods(res.foods || []);
        setTotalPages(res.totalPages || 1);
        setTotalFoods(res.totalFoods || 0);
      } else {
        setError(res.message || 'Failed to fetch foods');
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
      setError('Unable to load foods. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, dietaryType]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  // Filter change handlers (reset page to 1)
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleDietaryTypeChange = (newDietary) => {
    setDietaryType(newDietary);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setDietaryType('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search || category || dietaryType);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-warmBg-border">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
                Explore Foods
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                {totalFoods} Dishes
              </span>
            </div>
            <p className="text-sm text-charcoal-600 mt-1">
              Find Indian foods and understand what you're eating with familiar serving sizes.
            </p>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="space-y-4">
          <FoodSearch value={search} onChange={handleSearchChange} />
          <FoodFilters
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
            selectedDietaryType={dietaryType}
            onSelectDietaryType={handleDietaryTypeChange}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Main Content Area */}
        {loading ? (
          /* Loading State Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-warmBg-border p-4 space-y-3 animate-pulse"
              >
                <div className="h-40 bg-warmBg-muted rounded-xl w-full" />
                <div className="h-4 bg-warmBg-muted rounded w-3/4" />
                <div className="h-3 bg-warmBg-muted rounded w-1/2" />
                <div className="h-10 bg-warmBg-muted rounded-xl w-full mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4 my-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <div>
              <h3 className="text-base font-bold">Unable to load foods</h3>
              <p className="text-xs text-rose-600 mt-1">{error}</p>
            </div>
            <button
              onClick={loadFoods}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-soft-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        ) : foods.length === 0 ? (
          /* Empty Search Result State */
          <div className="bg-white border border-warmBg-border rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 my-8 shadow-soft-sm">
            <div className="w-16 h-16 rounded-full bg-warmBg-muted flex items-center justify-center mx-auto text-charcoal-400">
              <Utensils className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal-900">No foods found</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Try searching with another food name or changing your selected filters.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-soft-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        ) : (
          /* Food Grid */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-warmBg-border bg-white px-4 py-3 rounded-2xl shadow-soft-sm">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-charcoal-700 bg-warmBg hover:bg-warmBg-muted border border-warmBg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-bold text-charcoal-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-charcoal-700 bg-warmBg hover:bg-warmBg-muted border border-warmBg-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
