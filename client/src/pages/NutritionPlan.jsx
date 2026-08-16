import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import AppLayout from '../components/AppLayout';
import {
  formatGoal,
  formatActivityLevel,
  formatDiet,
  formatAllergies,
  getGoalAdjustmentLabel,
  getGoalExplanation,
} from '../utils/formatters';
import {
  Flame,
  Activity,
  Target,
  Edit3,
  AlertCircle,
  TrendingUp,
  Info,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

export default function NutritionPlan() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [nutritionTarget, setNutritionTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Fetch Profile
      const profileRes = await fetch(`${APP_CONFIG.apiBaseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const profileData = await profileRes.json();

      if (!profileRes.ok || !profileData.success || !profileData.profileCompleted) {
        // Redirect to onboarding if profile is incomplete
        navigate('/onboarding', { replace: true });
        return;
      }
      setProfile(profileData.profile);

      // 2. Fetch NutritionTarget
      let targetRes = await fetch(`${APP_CONFIG.apiBaseUrl}/nutrition-targets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      let targetData = await targetRes.json();

      // If target missing, generate target automatically
      if (!targetData.nutritionTarget) {
        const genRes = await fetch(`${APP_CONFIG.apiBaseUrl}/nutrition-targets/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        targetData = await genRes.json();
      }

      if (targetData.success && targetData.nutritionTarget) {
        setNutritionTarget(targetData.nutritionTarget);
      } else {
        setError(targetData.message || 'Unable to load your nutrition plan.');
      }
    } catch (err) {
      console.error('Error fetching nutrition plan data:', err);
      setError('Network error. We couldn\'t load your nutrition plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${APP_CONFIG.apiBaseUrl}/nutrition-targets/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success && data.nutritionTarget) {
        setNutritionTarget(data.nutritionTarget);
        setSuccessMsg('Your nutrition targets have been updated.');
      } else {
        setError(data.message || 'Failed to update nutrition plan.');
      }
    } catch (err) {
      console.error('Error updating nutrition plan:', err);
      setError('Network error updating nutrition plan.');
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-charcoal-700">Loading your nutrition plan...</p>
        </div>
      </AppLayout>
    );
  }

  if (error && !nutritionTarget) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-warmBg-border shadow-soft-sm text-center space-y-4">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-display font-extrabold text-lg text-charcoal-900">
            We couldn't load your nutrition plan.
          </h2>
          <p className="text-xs text-charcoal-600 font-medium leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchData}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-soft hover:shadow-floating transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 inline-block">
            Starting Targets
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
            Your Nutrition Plan
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 font-medium">
            Your starting daily targets based on your profile, activity level, and goal.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-brand-800 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-brand-700 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* 1. DAILY CALORIE TARGET CARD */}
        {nutritionTarget && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warmBg-border shadow-soft-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="block text-xs font-extrabold uppercase tracking-wider text-charcoal-500 mb-1">
                  Your Daily Target
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-charcoal-900 tracking-tight">
                    {nutritionTarget.calories?.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-brand-700">kcal</span>
                </div>
                <p className="text-xs text-charcoal-600 font-medium mt-1">
                  Estimated calories for your current goal
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-800 border border-brand-200/80 text-xs font-extrabold">
                  <Target className="w-3.5 h-3.5 text-brand-600" />
                  <span>Goal: {formatGoal(profile?.goal)}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. MACRO TARGETS (3 Cards) */}
        {nutritionTarget && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800">
              Macronutrient Targets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Protein Card */}
              <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-2">
                <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 inline-block">
                  Protein
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-display text-charcoal-900">
                    {nutritionTarget.protein}
                  </span>
                  <span className="text-sm font-bold text-charcoal-600">g</span>
                </div>
                <p className="text-xs text-charcoal-500 font-medium">Daily target</p>
              </div>

              {/* Carbohydrates Card */}
              <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-2">
                <span className="text-xs font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-block">
                  Carbohydrates
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-display text-charcoal-900">
                    {nutritionTarget.carbohydrates}
                  </span>
                  <span className="text-sm font-bold text-charcoal-600">g</span>
                </div>
                <p className="text-xs text-charcoal-500 font-medium">Daily target</p>
              </div>

              {/* Fat Card */}
              <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-2">
                <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 inline-block">
                  Fat
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black font-display text-charcoal-900">
                    {nutritionTarget.fat}
                  </span>
                  <span className="text-sm font-bold text-charcoal-600">g</span>
                </div>
                <p className="text-xs text-charcoal-500 font-medium">Daily target</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. HOW YOUR TARGET WAS CALCULATED */}
        {nutritionTarget && profile && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warmBg-border shadow-soft-sm space-y-6">
            <div>
              <h2 className="font-display text-lg font-extrabold text-charcoal-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-600" />
                <span>How we estimated your target</span>
              </h2>
              <p className="text-xs text-charcoal-500 font-medium mt-0.5">
                Transparent step-by-step breakdown of your target calculation.
              </p>
            </div>

            {/* Step-by-step flow cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              {/* Step 1: BMR */}
              <div className="p-4 bg-warmBg rounded-2xl border border-warmBg-border space-y-1 flex flex-col justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  BMR
                </span>
                <span className="text-lg font-extrabold text-charcoal-900">
                  {nutritionTarget.bmr} kcal
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">Resting Energy</span>
              </div>

              {/* Arrow / Step 2: Activity */}
              <div className="p-4 bg-warmBg rounded-2xl border border-warmBg-border space-y-1 flex flex-col justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  Activity
                </span>
                <span className="text-sm font-extrabold text-charcoal-900 truncate">
                  {formatActivityLevel(profile.activityLevel)}
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">{nutritionTarget.activityMultiplier}x Factor</span>
              </div>

              {/* Step 3: Maintenance */}
              <div className="p-4 bg-warmBg rounded-2xl border border-warmBg-border space-y-1 flex flex-col justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  Estimated Maintenance
                </span>
                <span className="text-lg font-extrabold text-charcoal-900">
                  {nutritionTarget.tdee} kcal
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">TDEE</span>
              </div>

              {/* Step 4: Goal Adjustment */}
              <div className="p-4 bg-warmBg rounded-2xl border border-warmBg-border space-y-1 flex flex-col justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  Goal Adjustment
                </span>
                <span className="text-sm font-extrabold text-brand-700">
                  {getGoalAdjustmentLabel(profile.goal)}
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">{formatGoal(profile.goal)}</span>
              </div>

              {/* Step 5: Daily Target */}
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 space-y-1 flex flex-col justify-between">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-800">
                  Daily Target
                </span>
                <span className="text-lg font-black text-brand-900">
                  {nutritionTarget.calories} kcal
                </span>
                <span className="text-[10px] text-brand-700 font-bold">Final Target</span>
              </div>
            </div>

            {/* 4. SIMPLE EXPLANATIONS */}
            <div className="space-y-3 pt-2 border-t border-warmBg-border text-xs text-charcoal-700 leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-extrabold text-charcoal-900">BMR</h4>
                <p>BMR is an estimate of the energy your body uses at rest.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-charcoal-900">Maintenance Calories</h4>
                <p>Your estimated maintenance calories account for your usual activity level.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-charcoal-900">Goal Adjustment</h4>
                <p>{getGoalExplanation(profile.goal)}</p>
              </div>
            </div>

            {/* TRANSPARENCY NOTE */}
            <div className="p-3.5 bg-sage-50 rounded-2xl border border-sage-200 text-xs text-charcoal-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                These are starting estimates, not medical prescriptions. Your actual needs can vary, and your targets may be adjusted as your progress changes.
              </span>
            </div>
          </div>
        )}

        {/* 5. YOUR PROFILE SUMMARY */}
        {profile && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warmBg-border shadow-soft-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-extrabold text-charcoal-900">
                  Your Profile
                </h2>
                <p className="text-xs text-charcoal-500 font-medium">
                  Summary of details used for your calculation.
                </p>
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Age</span>
                <span className="font-extrabold text-charcoal-900">{profile.age}</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Height</span>
                <span className="font-extrabold text-charcoal-900">{profile.height?.value} cm</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Weight</span>
                <span className="font-extrabold text-charcoal-900">{profile.weight?.value} kg</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Activity</span>
                <span className="font-extrabold text-charcoal-900">{formatActivityLevel(profile.activityLevel)}</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Goal</span>
                <span className="font-extrabold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                  {formatGoal(profile.goal)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Diet</span>
                <span className="font-extrabold text-charcoal-900">{formatDiet(profile.dietaryPreference)}</span>
              </div>
            </div>

            {profile.allergies && profile.allergies.length > 0 && !profile.allergies.includes('none') && (
              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border text-xs flex justify-between items-center">
                <span className="font-medium text-charcoal-500">Allergies</span>
                <span className="font-extrabold text-charcoal-900">{formatAllergies(profile.allergies)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
