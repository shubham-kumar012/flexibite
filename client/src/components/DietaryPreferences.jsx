import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Leaf, Heart, Utensils } from 'lucide-react';

export default function DietaryPreferences() {
  const [selectedPref, setSelectedPref] = useState('vegan');

  const preferences = [
    {
      id: 'vegan',
      title: 'Vegan',
      tagline: '100% Plant-Based Indian Cooking',
      description: 'Focus on rich dals, legumes, vegetables, rotis, rice, coconut curries, and plant protein sources.',
      icon: '🌿',
      badge: 'Plant-Forward Focus',
    },
    {
      id: 'veg',
      title: 'Vegetarian',
      tagline: 'Traditional Sattvic & Lacto-Vegetarian',
      description: 'Includes paneer, fresh curd (dahi), ghee, milk, dals, rotis, and diverse regional vegetable sabzis.',
      icon: '🫓',
      badge: 'Classic Indian',
    },
    {
      id: 'eggetarian',
      title: 'Eggetarian',
      tagline: 'Vegetarian + Eggs',
      description: 'Combines plant-based Indian staples with egg bhurji, boiled eggs, and egg curry options.',
      icon: '🥚',
      badge: 'Flexible Protein',
    },
    {
      id: 'nonveg',
      title: 'Non-Vegetarian',
      tagline: 'Inclusive Balanced Indian Meals',
      description: 'Accommodates chicken, fish, and meat curries along with plant-rich home-cooked sides.',
      icon: '🍲',
      badge: 'Welcoming to All',
    },
  ];

  const current = preferences.find((p) => p.id === selectedPref) || preferences[0];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-warmBg-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Inclusive & Thoughtful</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Your food. Your choices. Your goals.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            FlexiBite celebrates Indian food culture across all dietary preferences, with a strong focus on plant-forward nutrition that welcomes everyone.
          </p>
        </div>

        {/* Dietary Switcher Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          {preferences.map((pref) => {
            const isSelected = selectedPref === pref.id;
            return (
              <button
                key={pref.id}
                onClick={() => setSelectedPref(pref.id)}
                className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all duration-200 flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-soft'
                    : 'bg-warmBg text-charcoal-700 border-warmBg-border hover:border-brand-300'
                }`}
              >
                <span className="text-2xl">{pref.icon}</span>
                <span>{pref.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Preference Card */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto bg-warmBg p-8 rounded-3xl border border-warmBg-border shadow-soft text-center space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          <h3 className="font-display text-2xl font-extrabold text-charcoal-900">
            {current.tagline}
          </h3>

          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed max-w-xl mx-auto">
            {current.description}
          </p>

          <p className="text-xs text-charcoal-500 font-medium pt-2">
            Nutrition for everyone, thoughtfully designed around Indian food.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
