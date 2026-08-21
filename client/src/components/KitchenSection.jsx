import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Check, Utensils, Info } from 'lucide-react';

export default function KitchenSection() {
  const pantryOptions = [
    { id: 'potato', name: 'Potato', icon: '🥔', count: 3, selected: true },
    { id: 'banana', name: 'Banana', icon: '🍌', count: 2, selected: true },
    { id: 'bhindi', name: 'Ladyfinger (Bhindi)', icon: '🥬', count: 1, selected: true },
    { id: 'tomato', name: 'Tomato', icon: '🍅', count: 4, selected: true },
    { id: 'soychunks', name: 'Soy Chunks', icon: '🫘', count: 1, selected: true },
    { id: 'paneer', name: 'Paneer', icon: '🧀', count: 1, selected: false },
    { id: 'spinach', name: 'Spinach (Palak)', icon: '🍃', count: 1, selected: false },
    { id: 'rice', name: 'Basmati Rice', icon: '🍚', count: 1, selected: false },
  ];

  const [items, setItems] = useState(pantryOptions);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <section className="py-16 sm:py-24 bg-warmBg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmAccent-100 text-warmAccent-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Food Waste • Smart Recipes</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Tell us what's in your kitchen. We'll help with the rest.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            Select what ingredients you already have at home. FlexiBite suggests authentic Indian meals that match your remaining macro targets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">

          {/* Left: Interactive Pantry Items Selector */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-charcoal-900">Your Available Pantry</h3>
                <p className="text-xs text-charcoal-500 font-medium">Click ingredients to toggle available items</p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                {selectedCount} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${item.selected
                      ? 'bg-brand-50/70 border-brand-300 text-charcoal-900 shadow-soft-sm'
                      : 'bg-warmBg/50 border-warmBg-border text-charcoal-500 opacity-60 hover:opacity-100'
                    }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-lg">{item.icon}</span>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{item.name}</div>
                      <div className="text-[10px] text-charcoal-500">× {item.count}</div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${item.selected ? 'bg-brand-600 text-white' : 'bg-warmBg-border text-charcoal-400'
                      }`}
                  >
                    {item.selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Dynamic Suggested Meal Output */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCount}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-brand-500/40 shadow-floating relative overflow-hidden space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wider">
                  <Utensils className="w-3 h-3" />
                  <span>Smart Meal Recommendation</span>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-charcoal-500 tracking-wider">Suggested Meal</h4>
                  <div className="font-display font-extrabold text-2xl text-charcoal-900 mt-1">
                    Aloo Bhindi + Roti + Banana
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-warmBg border border-warmBg-border">
                  <div>
                    <span className="text-xs font-medium text-charcoal-500">Estimated Calories</span>
                    <div className="font-display font-extrabold text-lg text-brand-700 mt-0.5">
                      ~ 650 kcal
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-charcoal-500">Protein</span>
                    <div className="font-display font-extrabold text-lg text-brand-700 mt-0.5">
                      ~ 20g
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-brand-200 space-y-1">
                  <div className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Why this meal?
                  </div>
                  <p className="text-xs text-brand-800 leading-relaxed">
                    Because it fits your remaining nutrition target for the day seamlessly while utilizing ingredients currently available in your kitchen.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Required Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-warmBg border border-warmBg-border flex items-start gap-2.5 text-xs text-charcoal-500">
              <Info className="w-4 h-4 text-charcoal-400 flex-shrink-0 mt-0.5" />
              <span>
                Nutrition values are estimates and can vary based on ingredients and preparation.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
