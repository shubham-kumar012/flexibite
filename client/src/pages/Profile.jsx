import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import AppLayout from '../components/AppLayout';
import {
  formatGoal,
  formatActivityLevel,
  formatDiet,
  formatAllergies,
} from '../utils/formatters';
import {
  User as UserIcon,
  Mail,
  Sparkles,
  Edit3,
  CheckCircle2,
  Activity,
  Target,
  Utensils,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

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
      setError('Failed to load profile information.');
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    setLoading(false);
  }, [token]);

  // Recalculate Nutrition Plan handler
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
      if (res.ok && data.success) {
        setSuccessMsg('Your nutrition targets have been updated.');
      } else {
        setError(data.message || 'Failed to recalculate nutrition plan.');
      }
    } catch (err) {
      console.error('Error recalculating targets:', err);
      setError('Network error recalculating nutrition plan.');
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-charcoal-700">Loading your profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 inline-block mb-1">
              Account & Profile
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
              User Profile
            </h1>
          </div>

          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-soft hover:shadow-floating transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-brand-50 border border-brand-200/80 rounded-2xl text-brand-800 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
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

        {/* User Account Info */}
        <div className="bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-4">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800">
            Account Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
              <div className="p-2 bg-white rounded-lg text-brand-600 shadow-soft-sm">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-charcoal-400">Name</span>
                <span className="text-xs font-bold text-charcoal-800">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
              <div className="p-2 bg-white rounded-lg text-brand-600 shadow-soft-sm">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[11px] font-semibold text-charcoal-400">Email</span>
                <span className="text-xs font-bold text-charcoal-800 truncate block">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Profile Details */}
        {profileCompleted && profile ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-warmBg-border">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                <span>Body & Nutrition Profile</span>
              </h2>

              <button
                onClick={handleRecalculate}
                disabled={recalculating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                <span>{recalculating ? 'Updating...' : 'Recalculate Nutrition Plan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Age</span>
                <span className="text-base font-extrabold text-charcoal-900">{profile.age}</span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Height</span>
                <span className="text-base font-extrabold text-charcoal-900">
                  {profile.height?.value} cm
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border text-center space-y-1">
                <span className="block text-[11px] font-semibold text-charcoal-500">Weight</span>
                <span className="text-base font-extrabold text-charcoal-900">
                  {profile.weight?.value} kg
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-600">Activity Level</span>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatActivityLevel(profile.activityLevel)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-600">Goal</span>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200/60">
                    {formatGoal(profile.goal)}
                  </span>
                  {profile.targetWeight?.value && (
                    <span className="block text-[11px] text-charcoal-500 font-medium mt-0.5">
                      Target: {profile.targetWeight.value} kg
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal-600">Dietary Preference</span>
                <span className="text-xs font-extrabold text-charcoal-900">
                  {formatDiet(profile.dietaryPreference)}
                </span>
              </div>

              <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex items-start justify-between gap-4">
                <span className="text-xs font-semibold text-charcoal-600">Allergies</span>
                <span className="text-xs font-bold text-charcoal-900 text-right">
                  {formatAllergies(profile.allergies)}
                </span>
              </div>

              {profile.dislikedFoods && profile.dislikedFoods.length > 0 && (
                <div className="p-3.5 bg-warmBg rounded-xl border border-warmBg-border flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold text-charcoal-600">Foods Disliked</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {profile.dislikedFoods.map((food) => (
                      <span
                        key={food}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-warmBg-border text-charcoal-800"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/nutrition-plan"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
              >
                <span>View Full Calculated Nutrition Plan</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-sage-50 border border-sage-200 rounded-2xl text-center space-y-3">
            <p className="text-xs font-semibold text-charcoal-700">
              You haven't completed your body profile setup yet.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-soft hover:shadow-floating transition-all"
            >
              Complete Profile Setup
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
