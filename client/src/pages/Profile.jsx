import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import {
  User as UserIcon,
  Mail,
  LogOut,
  Sparkles,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  Activity,
  Target,
  Utensils,
  ShieldAlert,
} from 'lucide-react';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${APP_CONFIG.apiBaseUrl}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setProfileCompleted(data.profileCompleted);
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Helper formatting functions
  const formatGoal = (goal) => {
    switch (goal) {
      case 'lose_weight':
        return 'Lose Weight';
      case 'maintain_weight':
        return 'Maintain Weight';
      case 'gain_weight':
        return 'Gain Weight';
      default:
        return goal || 'N/A';
    }
  };

  const formatDiet = (diet) => {
    switch (diet) {
      case 'vegan':
        return 'Vegan';
      case 'vegetarian':
        return 'Vegetarian';
      case 'eggetarian':
        return 'Eggetarian';
      case 'non_vegetarian':
        return 'Non-Vegetarian';
      default:
        return diet || 'N/A';
    }
  };

  const formatActivityLevel = (level) => {
    switch (level) {
      case 'sedentary':
        return 'Sedentary';
      case 'lightly_active':
        return 'Lightly Active';
      case 'moderately_active':
        return 'Moderately Active';
      case 'very_active':
        return 'Very Active';
      default:
        return level ? level.replace(/_/g, ' ') : 'Not set';
    }
  };

  const formatAllergies = (allergies) => {
    if (!allergies || allergies.length === 0 || allergies.includes('none')) {
      return 'No known allergies';
    }
    return allergies
      .map((a) => a.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
      .join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-charcoal-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmBg flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-700 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <img src={APP_CONFIG.logoUrl} alt={APP_CONFIG.name} className="w-8 h-8 object-contain" />
          <span className="font-display font-extrabold text-lg text-charcoal-900">{APP_CONFIG.name}</span>
        </div>
      </div>

      {/* Profile Container */}
      <div className="max-w-xl mx-auto w-full my-8 bg-white p-6 sm:p-10 rounded-3xl border border-warmBg-border shadow-floating space-y-6">
        
        {/* Success Banner if redirected from onboarding */}
        {successMsg && (
          <div className="p-3.5 bg-brand-50 border border-brand-200/80 rounded-2xl text-brand-800 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg('')}
              className="text-brand-600 hover:text-brand-900 text-xs underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header & Welcome */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>User Profile</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-charcoal-900">
            Profile Overview
          </h1>
          <h2 className="text-lg font-bold text-brand-700">
            Welcome, {user?.name || 'User'}
          </h2>
        </div>

        {/* User Basic Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-2xl border border-warmBg-border">
            <div className="p-2 bg-white rounded-xl text-brand-600 shadow-soft-sm">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-charcoal-400">Name</span>
              <span className="text-xs font-bold text-charcoal-800">{user?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-2xl border border-warmBg-border">
            <div className="p-2 bg-white rounded-lg text-brand-600 shadow-soft-sm">
              <Mail className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[11px] font-semibold text-charcoal-400">Email</span>
              <span className="text-xs font-bold text-charcoal-800 truncate block">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Nutrition Profile Section */}
        {profileCompleted && profile ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-warmBg-border">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                Nutrition & Body Summary
              </h3>
              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200/60 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Age</span>
                <span className="text-base font-extrabold text-charcoal-900">{profile.age}</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Height</span>
                <span className="text-base font-extrabold text-charcoal-900">
                  {profile.height?.value} {profile.height?.unit || 'cm'}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Weight</span>
                <span className="text-base font-extrabold text-charcoal-900">
                  {profile.weight?.value} {profile.weight?.unit || 'kg'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-semibold text-charcoal-600">Activity Level</span>
                </div>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatActivityLevel(profile.activityLevel)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-semibold text-charcoal-600">Goal</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                    {formatGoal(profile.goal)}
                  </span>
                  {profile.targetWeight?.value && (
                    <span className="block text-[11px] text-charcoal-500 font-medium mt-0.5">
                      Target: {profile.targetWeight.value} {profile.targetWeight.unit || 'kg'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-semibold text-charcoal-600">Dietary Preference</span>
                </div>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatDiet(profile.dietaryPreference)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-xs font-semibold text-charcoal-600">Allergies</span>
                </div>
                <span className="text-xs font-bold text-charcoal-900 text-right">
                  {formatAllergies(profile.allergies)}
                </span>
              </div>

              {profile.dislikedFoods && profile.dislikedFoods.length > 0 && (
                <div className="p-3.5 bg-warmBg rounded-2xl border border-warmBg-border flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold text-charcoal-600">Foods Disliked</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {profile.dislikedFoods.map((food) => (
                      <span
                        key={food}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-warmBg-border text-charcoal-800"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-[11px] text-charcoal-500 text-center bg-sage-50 p-2.5 rounded-xl border border-sage-200/60">
              ℹ️ Your nutrition targets are estimates based on the information you provide.
            </p>
          </div>
        ) : (
          <div className="p-5 bg-sage-50 border border-sage-200/80 rounded-2xl text-center space-y-3">
            <p className="text-xs font-semibold text-charcoal-700">
              You haven't set up your nutrition & body profile yet.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full py-2.5 text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-soft hover:shadow-floating transition-all"
            >
              Complete Onboarding Now
            </button>
          </div>
        )}

        {/* Logout Button */}
        <div className="pt-4 border-t border-warmBg-border">
          <button
            onClick={handleLogout}
            className="w-full py-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.
      </div>
    </div>
  );
}
