import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  User as UserIcon,
  Activity,
  Target,
  Utensils,
  Check,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'About You', icon: UserIcon },
  { id: 2, name: 'Body', icon: Activity },
  { id: 3, name: 'Goal', icon: Target },
  { id: 4, name: 'Diet & Allergies', icon: Utensils },
];

const ALLERGY_OPTIONS = [
  { id: 'none', label: 'No known allergies' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts' },
  { id: 'milk_dairy', label: 'Milk / Dairy' },
  { id: 'soy', label: 'Soy' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
];

const DIET_OPTIONS = [
  {
    id: 'vegan',
    title: 'Vegan',
    desc: 'Strictly plant-based meals with no animal products or dairy.',
    badge: '🌱 Plant Based',
  },
  {
    id: 'vegetarian',
    title: 'Vegetarian',
    desc: 'Plant-based diet including dairy products like milk, curd, and paneer.',
    badge: '🧀 Lacto Vegetarian',
  },
  {
    id: 'eggetarian',
    title: 'Eggetarian',
    desc: 'Vegetarian diet that includes eggs along with dairy products.',
    badge: '🥚 Egg & Dairy',
  },
  {
    id: 'non_vegetarian',
    title: 'Non-Vegetarian',
    desc: 'Includes poultry, meat, fish, eggs, and dairy products.',
    badge: '🍗 All Foods',
  },
];

const GOAL_OPTIONS = [
  {
    id: 'lose_weight',
    title: 'Lose Weight',
    desc: 'Work toward a sustainable calorie deficit.',
    badge: '🔥 Calorie Deficit',
  },
  {
    id: 'maintain_weight',
    title: 'Maintain Weight',
    desc: 'Maintain your current weight with balanced nutrition.',
    badge: '⚖️ Balance',
  },
  {
    id: 'gain_weight',
    title: 'Gain Weight',
    desc: 'Work toward a healthy calorie surplus.',
    badge: '💪 Calorie Surplus',
  },
];

const ACTIVITY_LEVEL_OPTIONS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    desc: 'Little or no regular exercise; mostly sitting during the day.',
  },
  {
    id: 'lightly_active',
    title: 'Lightly Active',
    desc: 'Light exercise or sports around 1–3 days per week.',
  },
  {
    id: 'moderately_active',
    title: 'Moderately Active',
    desc: 'Regular exercise or sports around 3–5 days per week.',
  },
  {
    id: 'very_active',
    title: 'Very Active',
    desc: 'Hard exercise, sports, or a physically active lifestyle most days.',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(true);
  const [error, setError] = useState('');

  // Form State - dietaryPreference initialized as empty string to require explicit selection on Step 4
  const [formData, setFormData] = useState({
    age: '',
    gender: 'prefer_not_to_say',
    heightValue: '',
    weightValue: '',
    activityLevel: '',
    goal: 'maintain_weight',
    targetWeightValue: '',
    dietaryPreference: '',
    allergies: [],
    dislikedFoods: [],
  });

  // Temp state for adding disliked food tag
  const [dislikedInput, setDislikedInput] = useState('');

  // Fetch existing profile if user is editing or already started
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!token) {
        setFetchingExisting(false);
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
        if (response.ok && data.success && data.profile) {
          const p = data.profile;
          setFormData({
            age: p.age ? String(p.age) : '',
            gender: p.gender || 'prefer_not_to_say',
            heightValue: p.height?.value ? String(p.height.value) : '',
            weightValue: p.weight?.value ? String(p.weight.value) : '',
            activityLevel: p.activityLevel || '',
            goal: p.goal || 'maintain_weight',
            targetWeightValue: p.targetWeight?.value ? String(p.targetWeight.value) : '',
            dietaryPreference: p.dietaryPreference || '',
            allergies: p.allergies || [],
            dislikedFoods: p.dislikedFoods || [],
          });
        }
      } catch (err) {
        console.error('Error checking existing profile:', err);
      } finally {
        setFetchingExisting(false);
      }
    };

    fetchExistingProfile();
  }, [token]);

  // Validation function per step
  const validateStep = (step) => {
    setError('');

    if (step === 1) {
      if (!formData.age || Number(formData.age) <= 0) {
        setError('Please enter a valid age greater than 0.');
        return false;
      }
      if (Number(formData.age) > 120) {
        setError('Please enter a realistic age value.');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.heightValue || Number(formData.heightValue) <= 0) {
        setError('Please enter a valid height in cm.');
        return false;
      }
      if (Number(formData.heightValue) < 50 || Number(formData.heightValue) > 250) {
        setError('Please enter a height between 50 cm and 250 cm.');
        return false;
      }
      if (!formData.weightValue || Number(formData.weightValue) <= 0) {
        setError('Please enter a valid weight in kg.');
        return false;
      }
      if (Number(formData.weightValue) < 20 || Number(formData.weightValue) > 300) {
        setError('Please enter a weight between 20 kg and 300 kg.');
        return false;
      }
      if (!formData.activityLevel) {
        setError('Please select your activity level.');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.goal) {
        setError('Please select your primary wellness goal.');
        return false;
      }
      if (formData.goal === 'lose_weight' || formData.goal === 'gain_weight') {
        if (!formData.targetWeightValue || Number(formData.targetWeightValue) <= 0) {
          setError('Please enter your target weight in kg.');
          return false;
        }
        if (Number(formData.targetWeightValue) < 20 || Number(formData.targetWeightValue) > 300) {
          setError('Please enter a target weight between 20 kg and 300 kg.');
          return false;
        }
      }
    }

    if (step === 4) {
      if (!formData.dietaryPreference) {
        setError('Please select a dietary preference.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Toggle Allergy Selection
  const toggleAllergy = (allergyId) => {
    let updated = [...formData.allergies];

    if (allergyId === 'none') {
      if (updated.includes('none')) {
        updated = [];
      } else {
        updated = ['none'];
      }
    } else {
      // Remove 'none' if selecting a specific allergy
      updated = updated.filter((item) => item !== 'none');
      if (updated.includes(allergyId)) {
        updated = updated.filter((item) => item !== allergyId);
      } else {
        updated.push(allergyId);
      }
    }

    setFormData({ ...formData, allergies: updated });
  };

  // Add Disliked Food tag
  const handleAddDislikedFood = () => {
    const trimmed = dislikedInput.trim();
    if (!trimmed) return;

    if (!formData.dislikedFoods.includes(trimmed)) {
      setFormData({
        ...formData,
        dislikedFoods: [...formData.dislikedFoods, trimmed],
      });
    }
    setDislikedInput('');
  };

  // Remove Disliked Food tag
  const handleRemoveDislikedFood = (foodToRemove) => {
    setFormData({
      ...formData,
      dislikedFoods: formData.dislikedFoods.filter((item) => item !== foodToRemove),
    });
  };

  // Handle Enter key on input fields to prevent premature form submission
  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < 4) {
        handleNext();
      }
    }
  };

  // Submit Final Profile
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (currentStep !== 4) return;
    if (!validateStep(4)) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        age: Number(formData.age),
        gender: formData.gender,
        height: {
          value: Number(formData.heightValue),
          unit: 'cm',
        },
        weight: {
          value: Number(formData.weightValue),
          unit: 'kg',
        },
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        targetWeight:
          formData.targetWeightValue && (formData.goal === 'lose_weight' || formData.goal === 'gain_weight')
            ? {
              value: Number(formData.targetWeightValue),
              unit: 'kg',
            }
            : undefined,
        dietaryPreference: formData.dietaryPreference,
        allergies: formData.allergies,
        dislikedFoods: formData.dislikedFoods,
      };

      const response = await fetch(`${APP_CONFIG.apiBaseUrl}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        navigate('/profile', {
          state: { message: 'Your profile has been set up successfully.' },
        });
      } else {
        setError(data.message || 'Failed to save profile. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
      setLoading(false);
      setError('Network error. Unable to connect to server.');
    }
  };

  if (fetchingExisting) {
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
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-700 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Profile</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <img src={APP_CONFIG.logoUrl} alt={APP_CONFIG.name} className="w-8 h-8 object-contain" />
          <span className="font-display font-extrabold text-lg text-charcoal-900">{APP_CONFIG.name}</span>
        </div>
      </div>

      {/* Onboarding Container */}
      <div className="max-w-2xl mx-auto w-full my-8 bg-white p-6 sm:p-10 rounded-3xl border border-warmBg-border shadow-floating space-y-8">

        {/* Header & Step Indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full">
              Step {currentStep} of 4
            </span>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Personalized Setup</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-full h-2 rounded-full transition-all duration-300 ${isCompleted || isCurrent ? 'bg-brand-600' : 'bg-warmBg-muted'
                      }`}
                  />
                  <div className="flex items-center gap-1.5 text-xs">
                    <StepIcon
                      className={`w-3.5 h-3.5 hidden sm:inline ${isCurrent ? 'text-brand-600 font-bold' : isCompleted ? 'text-brand-700' : 'text-charcoal-400'
                        }`}
                    />
                    <span
                      className={`text-[11px] font-semibold text-center hidden sm:inline ${isCurrent ? 'text-charcoal-900 font-extrabold' : isCompleted ? 'text-charcoal-700' : 'text-charcoal-400'
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP FORM CONTENTS */}
        <form onSubmit={(e) => { e.preventDefault(); if (currentStep === 4) handleSubmit(e); }}>

          {/* STEP 1 — ABOUT YOU */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                  Let's get to know you
                </h1>
                <p className="text-sm text-charcoal-600 mt-1.5">
                  A few details help us personalize your nutrition experience.
                </p>
              </div>

              <div className="space-y-4">
                {/* Age Input */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    onKeyDown={handleKeyDownInput}
                    placeholder="e.g. 24"
                    className="w-full px-4 py-3 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all font-semibold text-charcoal-900"
                  />
                </div>

                {/* Gender Select */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'male', label: 'Male' },
                      { id: 'female', label: 'Female' },
                      { id: 'other', label: 'Other' },
                      { id: 'prefer_not_to_say', label: 'Prefer not to say' },
                    ].map((g) => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setFormData({ ...formData, gender: g.id })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${formData.gender === g.id
                            ? 'bg-brand-50 border-brand-600 text-brand-800 shadow-soft-sm'
                            : 'bg-warmBg border-warmBg-border text-charcoal-700 hover:border-brand-300'
                          }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-charcoal-500 mt-2 bg-sage-50 p-2.5 rounded-lg border border-sage-200/60">
                    💡 Some nutrition calculations can use this information, but you can choose not to provide it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — BODY INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                  Tell us about your body
                </h1>
                <p className="text-sm text-charcoal-600 mt-1.5">
                  Your height and weight help us estimate your nutrition needs more accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Height Input */}
                <div className="p-4 rounded-2xl border border-warmBg-border bg-warmBg/50 space-y-2">
                  <label className="block text-xs font-bold text-charcoal-800">
                    Height <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      max="250"
                      required
                      value={formData.heightValue}
                      onChange={(e) => setFormData({ ...formData, heightValue: e.target.value })}
                      onKeyDown={handleKeyDownInput}
                      placeholder="170"
                      className="w-full px-4 py-2.5 text-base font-bold rounded-xl bg-white border border-warmBg-border focus:border-brand-600 focus:outline-none transition-all text-charcoal-900"
                    />
                    <span className="px-3.5 py-2.5 text-xs font-extrabold text-charcoal-700 bg-white border border-warmBg-border rounded-xl">
                      cm
                    </span>
                  </div>
                </div>

                {/* Weight Input */}
                <div className="p-4 rounded-2xl border border-warmBg-border bg-warmBg/50 space-y-2">
                  <label className="block text-xs font-bold text-charcoal-800">
                    Current Weight <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="20"
                      max="300"
                      required
                      value={formData.weightValue}
                      onChange={(e) => setFormData({ ...formData, weightValue: e.target.value })}
                      onKeyDown={handleKeyDownInput}
                      placeholder="65"
                      className="w-full px-4 py-2.5 text-base font-bold rounded-xl bg-white border border-warmBg-border focus:border-brand-600 focus:outline-none transition-all text-charcoal-900"
                    />
                    <span className="px-3.5 py-2.5 text-xs font-extrabold text-charcoal-700 bg-white border border-warmBg-border rounded-xl">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Level Selection */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800">
                    Activity Level <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-charcoal-500 mt-1 font-medium">
                    This helps us understand your typical daily activity and will be used later to estimate your nutrition needs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIVITY_LEVEL_OPTIONS.map((act) => {
                    const isSelected = formData.activityLevel === act.id;
                    return (
                      <div
                        key={act.id}
                        onClick={() => setFormData({ ...formData, activityLevel: act.id })}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${isSelected
                            ? 'border-brand-600 bg-brand-50/50 shadow-soft-sm'
                            : 'border-warmBg-border bg-white hover:border-brand-300'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-extrabold text-sm text-charcoal-900">{act.title}</h4>
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-charcoal-300'
                              }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-charcoal-600 font-medium mt-1.5 leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-800 font-medium">
                🔒 Your nutrition targets are estimates based on the information you provide.
              </div>
            </div>
          )}

          {/* STEP 3 — YOUR GOAL */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                  What are you working toward?
                </h1>
                <p className="text-sm text-charcoal-600 mt-1.5">
                  We'll use this goal later to personalize your nutrition targets and recommendations.
                </p>
              </div>

              {/* Goal Cards */}
              <div className="grid grid-cols-1 gap-3">
                {GOAL_OPTIONS.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setFormData({ ...formData, goal: g.id })}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${formData.goal === g.id
                        ? 'border-brand-600 bg-brand-50/50 shadow-soft-sm'
                        : 'border-warmBg-border bg-white hover:border-brand-300'
                      }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-base text-charcoal-900">{g.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-warmBg-border text-charcoal-700">
                          {g.badge}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 font-medium">{g.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${formData.goal === g.id ? 'border-brand-600 bg-brand-600 text-white' : 'border-charcoal-300'
                        }`}
                    >
                      {formData.goal === g.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Target Weight Field (for lose_weight or gain_weight) */}
              {(formData.goal === 'lose_weight' || formData.goal === 'gain_weight') && (
                <div className="p-4 rounded-2xl border border-warmBg-border bg-warmBg/50 space-y-2 animate-fadeIn">
                  <label className="block text-xs font-bold text-charcoal-800">
                    Target Weight <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="20"
                      max="300"
                      required
                      value={formData.targetWeightValue}
                      onChange={(e) => setFormData({ ...formData, targetWeightValue: e.target.value })}
                      onKeyDown={handleKeyDownInput}
                      placeholder="e.g. 60"
                      className="w-full px-4 py-2.5 text-base font-bold rounded-xl bg-white border border-warmBg-border focus:border-brand-600 focus:outline-none transition-all text-charcoal-900"
                    />
                    <span className="px-3.5 py-2.5 text-xs font-extrabold text-charcoal-700 bg-white border border-warmBg-border rounded-xl">
                      kg
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 — DIET & ALLERGIES */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                  Tell us about your food preferences
                </h1>
                <p className="text-sm text-charcoal-600 mt-1.5">
                  This helps us avoid foods you don't eat and make better recommendations later.
                </p>
              </div>

              {/* Dietary Preference Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Dietary Preference <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DIET_OPTIONS.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setFormData({ ...formData, dietaryPreference: d.id })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-1.5 ${formData.dietaryPreference === d.id
                          ? 'border-brand-600 bg-brand-50/50 shadow-soft-sm'
                          : 'border-warmBg-border bg-white hover:border-brand-300'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-extrabold text-sm text-charcoal-900">{d.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-warmBg-border text-charcoal-700">
                          {d.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-600 font-medium leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies Multi-Select */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Allergies (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGY_OPTIONS.map((allergy) => {
                    const isSelected = formData.allergies.includes(allergy.id);
                    return (
                      <button
                        type="button"
                        key={allergy.id}
                        onClick={() => toggleAllergy(allergy.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected
                            ? 'bg-brand-600 text-white shadow-soft-sm'
                            : 'bg-warmBg text-charcoal-700 border border-warmBg-border hover:border-brand-300'
                          }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{allergy.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Food Preferences: Foods You Don't Like */}
              <div className="space-y-3 pt-2 border-t border-warmBg-border">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                    Foods you don't like <span className="text-charcoal-400 font-normal lowercase">(optional)</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dislikedInput}
                    onChange={(e) => setDislikedInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDislikedFood();
                      }
                    }}
                    placeholder="e.g. Potato, Mushroom, Brinjal"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all font-semibold text-charcoal-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddDislikedFood}
                    className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold rounded-xl border border-brand-200/60 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Disliked Food Chips */}
                {formData.dislikedFoods.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.dislikedFoods.map((food) => (
                      <span
                        key={food}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage-100 border border-sage-300 text-sage-900 text-xs font-bold rounded-lg"
                      >
                        {food}
                        <button
                          type="button"
                          onClick={() => handleRemoveDislikedFood(food)}
                          className="hover:text-rose-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-warmBg-border">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="px-5 py-2.5 text-xs font-bold text-charcoal-700 bg-warmBg hover:bg-warmBg-muted disabled:opacity-30 rounded-xl border border-warmBg-border transition-all flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-soft hover:shadow-floating transition-all flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-2.5 text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-soft hover:shadow-floating transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : 'Finish & Save'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.
      </div>
    </div>
  );
}
