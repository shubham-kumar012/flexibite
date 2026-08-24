import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { getPublicFoodById } from '../services/foodService';
import {
  ArrowLeft,
  Utensils,
  Leaf,
  Egg,
  Flame,
  Scale,
  AlertTriangle,
  Tag,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const DIETARY_CONFIG = {
  vegan: { label: 'Vegan', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Leaf },
  vegetarian: { label: 'Vegetarian', bg: 'bg-green-50 text-green-700 border-green-200', icon: Leaf },
  eggetarian: { label: 'Eggetarian', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Egg },
  non_vegetarian: { label: 'Non-Vegetarian', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Utensils },
  unknown: { label: 'General', bg: 'bg-gray-50 text-gray-600 border-gray-200', icon: Utensils },
};

import ServingModal from '../components/foods/ServingModal';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [servingModalOpen, setServingModalOpen] = useState(false);

  // Selected serving state (default to first serving or 100g default)
  const [selectedServing, setSelectedServing] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPublicFoodById(id);
        if (res.success && res.food) {
          setFood(res.food);
          // Set initial default serving if available
          if (res.food.servings && res.food.servings.length > 0) {
            setSelectedServing(res.food.servings[0]);
          } else {
            setSelectedServing({ name: 'Standard Portion', unit: 'g', grams: 100 });
          }
        } else {
          setError(res.message || 'Food item not found');
        }
      } catch (err) {
        console.error('Error fetching food details:', err);
        setError('Unable to load food details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-8">
          <div className="h-6 w-32 bg-warmBg-muted rounded-lg" />
          <div className="h-64 bg-warmBg-muted rounded-2xl w-full" />
          <div className="h-8 bg-warmBg-muted rounded-lg w-1/2" />
          <div className="h-32 bg-warmBg-muted rounded-2xl w-full" />
        </div>
      </AppLayout>
    );
  }

  if (error || !food) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto my-12 p-8 bg-white border border-warmBg-border rounded-2xl text-center space-y-4 shadow-soft-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <div>
            <h2 className="text-lg font-bold text-charcoal-900">Food Item Not Found</h2>
            <p className="text-xs text-charcoal-500 mt-1">{error || 'This food dish could not be retrieved.'}</p>
          </div>
          <Link
            to="/foods"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-soft-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Foods</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const dietary = DIETARY_CONFIG[food.dietaryType] || DIETARY_CONFIG.unknown;
  const DietaryIcon = dietary.icon;

  const nutrition100g = food.nutritionPer100g || {};
  const servingsList = food.servings || [];

  // Default serving fallback if none exists in DB
  const availableServings = servingsList.length > 0
    ? servingsList
    : [{ name: 'Standard Portion', unit: 'g', grams: 100 }];

  const currentGrams = selectedServing?.grams || 100;
  const multiplier = currentGrams / 100;

  // Estimated serving calculations rounded cleanly
  const estimatedNutrition = {
    calories: Math.round((nutrition100g.calories || 0) * multiplier),
    protein: parseFloat(((nutrition100g.protein || 0) * multiplier).toFixed(1)),
    carbohydrates: parseFloat(((nutrition100g.carbohydrates || 0) * multiplier).toFixed(1)),
    fats: parseFloat(((nutrition100g.fats || 0) * multiplier).toFixed(1)),
    fibre: parseFloat(((nutrition100g.fibre || 0) * multiplier).toFixed(1)),
    freeSugar: parseFloat(((nutrition100g.freeSugar || 0) * multiplier).toFixed(1)),
    sodium: Math.round((nutrition100g.sodium || 0) * multiplier),
    calcium: parseFloat(((nutrition100g.calcium || 0) * multiplier).toFixed(1)),
    iron: parseFloat(((nutrition100g.iron || 0) * multiplier).toFixed(2)),
    vitaminC: parseFloat(((nutrition100g.vitaminC || 0) * multiplier).toFixed(1)),
  };

  const hasImage = Boolean(food.image?.url && !imageError);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/foods"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 hover:underline transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Foods</span>
          </Link>
        </div>

        {/* Hero Section Card */}
        <div className="bg-white rounded-3xl border border-warmBg-border shadow-soft overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Food Image with Fixed Aspect Ratio */}
          <div className="relative aspect-[4/3] w-full bg-warmBg-muted flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img
                src={food.image.url}
                alt={food.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-charcoal-400 p-6 text-center">
                <Utensils className="w-16 h-16 mb-2 text-charcoal-300" />
                <span className="text-sm font-semibold">No Image Available</span>
              </div>
            )}
          </div>

          {/* Food Overview */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  {food.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border ${dietary.bg}`}
                >
                  <DietaryIcon className="w-3.5 h-3.5" />
                  {dietary.label}
                </span>
              </div>

              <h1 className="font-display font-black text-2xl md:text-3xl text-charcoal-900 leading-tight">
                {food.name}
              </h1>
            </div>

            {/* Quick 100g Energy Badge */}
            <div className="p-4 rounded-2xl bg-warmBg border border-warmBg-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-charcoal-500">Base Energy</span>
                  <span className="font-display font-bold text-lg text-charcoal-900">
                    {Math.round(nutrition100g.calories || 0)} kcal
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-charcoal-400">per 100g</span>
            </div>

            {/* Add to Today's Diet button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setServingModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white border border-brand-700 transition-all flex items-center justify-center gap-2 shadow-soft hover:shadow-floating"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add to Today's Diet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Serving Size Selector Section (Familiar Indian Servings) */}
        <div className="bg-white rounded-3xl border border-warmBg-border p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-warmBg-border">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-charcoal-900">
                How much did you have?
              </h2>
              <p className="text-xs text-charcoal-500">
                Select a familiar Indian serving size to estimate your nutritional intake.
              </p>
            </div>
          </div>

          {/* Serving Options Radio / Chip Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableServings.map((serving, idx) => {
              const isSelected = selectedServing?.name === serving.name && selectedServing?.grams === serving.grams;
              return (
                <button
                  key={`${serving.name}-${idx}`}
                  type="button"
                  onClick={() => setSelectedServing(serving)}
                  className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-soft-sm'
                      : 'bg-warmBg border-warmBg-border hover:bg-white hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-charcoal-800'}`}>
                      {serving.name}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-brand-600 bg-brand-600' : 'border-charcoal-300 bg-white'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-charcoal-500">
                    {serving.grams}g
                  </span>
                </button>
              );
            })}
          </div>

          {/* Estimated Nutrition for Selected Serving Preview */}
          <div className="bg-brand-50/60 border border-brand-200/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-800">
                Estimated Nutrition for {selectedServing?.name || '100g'} ({currentGrams}g)
              </span>
              <span className="font-display font-black text-lg text-brand-900">
                {estimatedNutrition.calories} kcal
              </span>
            </div>

            {/* Quick Macro Breakdown Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-brand-200/60 text-center">
                <span className="block text-[11px] font-semibold text-charcoal-500">Protein</span>
                <span className="block text-sm font-extrabold text-brand-700">{estimatedNutrition.protein}g</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-200/60 text-center">
                <span className="block text-[11px] font-semibold text-charcoal-500">Carbs</span>
                <span className="block text-sm font-extrabold text-amber-700">{estimatedNutrition.carbohydrates}g</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-200/60 text-center">
                <span className="block text-[11px] font-semibold text-charcoal-500">Fats</span>
                <span className="block text-sm font-extrabold text-rose-700">{estimatedNutrition.fats}g</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-200/60 text-center">
                <span className="block text-[11px] font-semibold text-charcoal-500">Fibre</span>
                <span className="block text-sm font-extrabold text-emerald-700">{estimatedNutrition.fibre}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Nutrition Facts Table (per 100g & per serving) */}
        <div className="bg-white rounded-3xl border border-warmBg-border p-6 sm:p-8 shadow-soft-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-charcoal-900 pb-3 border-b border-warmBg-border">
            Complete Nutrition Facts
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-warmBg-border text-charcoal-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Nutrient</th>
                  <th className="py-2.5 px-3 text-right">Per 100g</th>
                  <th className="py-2.5 px-3 text-right text-brand-700">Per Serving ({currentGrams}g)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmBg-border font-medium text-charcoal-800">
                <tr>
                  <td className="py-2.5 px-3 font-bold">Calories</td>
                  <td className="py-2.5 px-3 text-right">{Math.round(nutrition100g.calories || 0)} kcal</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-700">{estimatedNutrition.calories} kcal</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Protein</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.protein || 0} g</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-700">{estimatedNutrition.protein} g</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Carbohydrates</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.carbohydrates || 0} g</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-700">{estimatedNutrition.carbohydrates} g</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Free Sugar</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.freeSugar || 0} g</td>
                  <td className="py-2.5 px-3 text-right">{estimatedNutrition.freeSugar} g</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Fats</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.fats || 0} g</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-700">{estimatedNutrition.fats} g</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Dietary Fibre</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.fibre || 0} g</td>
                  <td className="py-2.5 px-3 text-right font-bold text-brand-700">{estimatedNutrition.fibre} g</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Sodium</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.sodium || 0} mg</td>
                  <td className="py-2.5 px-3 text-right">{estimatedNutrition.sodium} mg</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Calcium</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.calcium || 0} mg</td>
                  <td className="py-2.5 px-3 text-right">{estimatedNutrition.calcium} mg</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Iron</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.iron || 0} mg</td>
                  <td className="py-2.5 px-3 text-right">{estimatedNutrition.iron} mg</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Vitamin C</td>
                  <td className="py-2.5 px-3 text-right">{nutrition100g.vitaminC || 0} mg</td>
                  <td className="py-2.5 px-3 text-right">{estimatedNutrition.vitaminC} mg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metadata: Allergens, Dietary, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allergens Box */}
          <div className="bg-white rounded-2xl border border-warmBg-border p-5 shadow-soft-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Allergens</span>
            </div>
            {food.allergens && food.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {food.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500 font-medium italic">
                No listed allergens
              </p>
            )}
          </div>

          {/* Tags Box */}
          <div className="bg-white rounded-2xl border border-warmBg-border p-5 shadow-soft-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-charcoal-700 uppercase tracking-wider">
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Tags & Classifications</span>
            </div>
            {food.tags && food.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {food.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-warmBg text-charcoal-700 border border-warmBg-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-500 font-medium italic">No tags listed</p>
            )}
          </div>
        </div>

        {/* Serving Selection & Macros Modal */}
        <ServingModal
          food={food}
          isOpen={servingModalOpen}
          onClose={() => setServingModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
}
