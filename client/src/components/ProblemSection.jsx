import React from 'react';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Sparkles, Utensils } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white/70 border-y border-warmBg-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>The FlexiBite Difference</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Nutrition tracking shouldn't feel like homework.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed">
            Most fitness apps force you to measure food in exact grams using a digital scale. But Indian home cooking is intuitive. We describe meals in rotis, bowls, and katoris.
          </p>
        </div>

        {/* Natural Meal Examples Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-16 max-w-4xl mx-auto">
          <span className="text-xs sm:text-sm font-semibold text-charcoal-500 mr-2">Familiar Indian Meals:</span>
          {['2 rotis', '1 katori dal', '1 bowl sabzi', '1 glass milk', '1 cup chai', '1 banana'].map((item) => (
            <span
              key={item}
              className="px-3.5 py-1.5 rounded-xl bg-warmBg border border-warmBg-border text-charcoal-800 text-xs sm:text-sm font-semibold shadow-soft-sm hover:border-brand-300 transition-colors"
            >
              ✨ {item}
            </span>
          ))}
        </div>

        {/* Contrasting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Card 1: Traditional Tracking */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-soft-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal-900 text-lg">Traditional Tracking</h3>
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> High friction & scale dependent
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full">Old Way</span>
            </div>

            <div className="space-y-3 font-mono text-sm mb-6">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-between">
                <span>127g Potato</span>
                <span className="text-xs text-slate-400">Scale required</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-between">
                <span>83g Dal</span>
                <span className="text-xs text-slate-400">Raw weight?</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-between">
                <span>42g Tomato</span>
                <span className="text-xs text-slate-400">Chopped grams</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-between">
                <span>18g Oil</span>
                <span className="text-xs text-slate-400">Milliliters conversion</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-200 pt-4">
              Requires carrying a scale everywhere and dissecting every home-cooked recipe before eating.
            </p>
          </motion.div>

          {/* Card 2: FlexiBite Approach */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 sm:p-8 rounded-2xl bg-emerald-50/70 border-2 border-brand-500/40 shadow-floating relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-brand-600 text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Recommended
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-charcoal-900 text-lg">Our Approach</h3>
                <p className="text-xs text-brand-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Natural & Effortless
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm font-semibold text-charcoal-800 mb-6">
              <div className="p-3 rounded-xl bg-white border border-brand-200/80 flex items-center justify-between shadow-soft-sm">
                <span className="flex items-center gap-2">🥔 2 small potatoes</span>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">Natural size</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-brand-200/80 flex items-center justify-between shadow-soft-sm">
                <span className="flex items-center gap-2">🍲 1 bowl dal</span>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">Standard katori</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-brand-200/80 flex items-center justify-between shadow-soft-sm">
                <span className="flex items-center gap-2">🍅 1 tomato</span>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">Whole item</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-brand-200/80 flex items-center justify-between shadow-soft-sm">
                <span className="flex items-center gap-2">🥄 1 tbsp oil</span>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">Household spoon</span>
              </div>
            </div>

            <div className="border-t border-brand-200/60 pt-4 flex items-center justify-between">
              <span className="font-display font-bold text-charcoal-900 text-sm">
                Track the way you actually eat.
              </span>
              <Sparkles className="w-5 h-5 text-brand-600 animate-pulse" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
