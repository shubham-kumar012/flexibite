import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import AppLayout from '../components/AppLayout';
import { getTodayDiet } from '../services/dietService';
import {
  formatGoal,
  formatActivityLevel,
  formatDiet,
  formatAllergies,
} from '../utils/formatters';
import {
  Flame,
  Activity,
  Target,
  Utensils,
  Sparkles,
  AlertCircle,
  Apple,
  Edit3,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [nutritionTarget, setNutritionTarget] = useState(null);
  const [todayTotals, setTodayTotals] = useState({ calories: 0, protein: 0, carbohydrates: 0, fats: 0, fibre: 0 });
  const [todayEntriesCount, setTodayEntriesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Greeting helper based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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
        setError(targetData.message || 'Unable to load nutrition targets.');
      }

      // 3. Fetch Today's Diet totals and entries count
      try {
        const dietData = await getTodayDiet();
        if (dietData.success) {
          setTodayTotals(dietData.totals || { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fibre: 0 });
          setTodayEntriesCount((dietData.entries || []).length);
        }
      } catch (dietErr) {
        console.error('Error fetching today\'s diet totals for dashboard:', dietErr);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Network error loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-charcoal-700">Loading your dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  // Calculate remaining calories cleanly
  const targetCalories = nutritionTarget?.calories || 2000;
  const consumedCalories = todayTotals.calories || 0;
  const remainingCalories = targetCalories - consumedCalories;

  // Macro target values
  const targetProtein = nutritionTarget?.protein || 75;
  const targetCarbs = nutritionTarget?.carbohydrates || 225;
  const targetFat = nutritionTarget?.fat || 50;

  // Percentage calculations clamped to max 100% for progress bars
  const proteinPercent = Math.min(100, Math.round(((todayTotals.protein || 0) / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round(((todayTotals.carbohydrates || 0) / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round(((todayTotals.fats || 0) / targetFat) * 100));

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft-sm">
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              {getGreeting()}, {user?.name || 'User'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 font-medium">
              Here's your nutrition overview for today.
            </p>
          </div>

          <Link
            to="/todays-diet"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-soft hover:shadow-floating transition-all shrink-0"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Today's Diet</span>
          </Link>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. DAILY TARGET CARD */}
        {nutritionTarget && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Calorie Target & Intake Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60 inline-block mb-3">
                  Today's Target
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-charcoal-900 tracking-tight">
                    {nutritionTarget.calories?.toLocaleString()}
                  </span>
                  <span className="text-lg font-bold text-brand-700">kcal</span>
                </div>
                <p className="text-xs text-charcoal-500 font-medium mt-1">
                  Daily calorie target
                </p>
              </div>

              <div className="pt-4 border-t border-warmBg-border space-y-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                  Today's Intake
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-charcoal-900">
                    {consumedCalories} kcal consumed
                  </span>
                  <span className={`text-xs font-bold ${remainingCalories >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {remainingCalories >= 0
                      ? `${remainingCalories} kcal remaining`
                      : `${Math.abs(remainingCalories)} kcal over target`}
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Summary */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-brand-600" />
                    <span>Your Goal</span>
                  </h3>
                  <span className="text-xs font-extrabold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                    {formatGoal(profile?.goal)}
                  </span>
                </div>

                <div className="mt-4">
                  {profile?.goal === 'maintain_weight' ? (
                    <span className="text-lg font-bold text-charcoal-900">
                      Maintain your current weight
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 text-xl font-black text-charcoal-900 font-display">
                      <span>{profile?.weight?.value} kg</span>
                      <span className="text-brand-600 font-sans text-sm">→</span>
                      <span>{profile?.targetWeight?.value} kg</span>
                    </div>
                  )}
                  <p className="text-xs text-charcoal-500 font-medium mt-1">
                    Based on your onboarding target setting
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-warmBg-border flex justify-end">
                <Link
                  to="/nutrition-plan"
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Calculation Details</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. MACRO TARGETS WITH REAL PROGRESS */}
        {nutritionTarget && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Apple className="w-4 h-4 text-brand-600" />
                <span>Daily Macro Targets</span>
              </h2>
              <Link
                to="/todays-diet"
                className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Protein Target */}
              <div className="bg-white p-5 rounded-xl border border-warmBg-border shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
                    Protein
                  </span>
                  <span className="text-xs font-bold text-charcoal-700">
                    {todayTotals.protein} / {targetProtein} g
                  </span>
                </div>
                <div className="w-full bg-warmBg rounded-full h-2 overflow-hidden border border-warmBg-border">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>

              {/* Carbohydrates Target */}
              <div className="bg-white p-5 rounded-xl border border-warmBg-border shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    Carbs
                  </span>
                  <span className="text-xs font-bold text-charcoal-700">
                    {todayTotals.carbohydrates} / {targetCarbs} g
                  </span>
                </div>
                <div className="w-full bg-warmBg rounded-full h-2 overflow-hidden border border-warmBg-border">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
              </div>

              {/* Fat Target */}
              <div className="bg-white p-5 rounded-xl border border-warmBg-border shadow-soft-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    Fat
                  </span>
                  <span className="text-xs font-bold text-charcoal-700">
                    {todayTotals.fats} / {targetFat} g
                  </span>
                </div>
                <div className="w-full bg-warmBg rounded-full h-2 overflow-hidden border border-warmBg-border">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PROFILE SNAPSHOT */}
        {profile && (
          <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                <span>Profile Snapshot</span>
              </h3>
              <Link
                to="/profile"
                className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
                <span className="block text-[11px] font-semibold text-charcoal-500">Activity</span>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatActivityLevel(profile.activityLevel)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
                <span className="block text-[11px] font-semibold text-charcoal-500">Diet</span>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatDiet(profile.dietaryPreference)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border col-span-2 sm:col-span-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Allergies</span>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatAllergies(profile.allergies)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. TODAY'S MEALS TRACKING SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto text-brand-700 border border-brand-200">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-charcoal-900">
              Today's Meals
            </h3>
            {todayEntriesCount === 0 ? (
              <>
                <p className="text-xs font-bold text-charcoal-700">
                  You haven't logged any meals today.
                </p>
                <p className="text-xs text-charcoal-500 leading-relaxed font-medium">
                  Search Indian foods and track your daily nutrition with familiar serving sizes.
                </p>
              </>
            ) : (
              <p className="text-xs font-bold text-charcoal-700">
                You have logged {todayEntriesCount} dish(es) today ({consumedCalories} kcal).
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              to="/foods"
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-soft inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Food</span>
            </Link>

            <Link
              to="/todays-diet"
              className="px-5 py-2.5 text-xs font-extrabold text-charcoal-800 bg-warmBg hover:bg-warmBg-muted border border-warmBg-border rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <Utensils className="w-3.5 h-3.5 text-brand-600" />
              <span>View Today's Diet</span>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
