import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

export default function FoodLoggingSection() {
  const timeline = [
    {
      time: 'Breakfast • 8:30 AM',
      title: 'Traditional Morning',
      items: ['2 rotis', '1 cup chai', '3 biscuits'],
      icon: '☕',
      bg: 'bg-amber-50/60 border-amber-200/70',
    },
    {
      time: 'Lunch • 1:15 PM',
      title: 'Hearty Indian Meal',
      items: ['1 bowl dal', '2 rotis', '1 bowl sabzi'],
      icon: '🍲',
      bg: 'bg-emerald-50/60 border-emerald-200/70',
    },
    {
      time: 'Evening • 6:30 PM',
      title: 'Spontaneous Treat',
      items: ['1 Veg Burger'],
      icon: '🍔',
      bg: 'bg-orange-50/60 border-orange-200/70',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-warmBg-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <span>Adaptive Tracking</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Real life doesn't follow a meal plan.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            A late-night snack or a sudden burger craving? Log whatever you actually eat. FlexiBite recalculates your target macros and adjusts dinner suggestions without guilt or judgment.
          </p>
        </div>

        {/* Timeline & Progress Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">

          {/* Left Timeline */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs uppercase font-extrabold text-charcoal-500 tracking-wider mb-2">Logged Today</h3>

            {timeline.map((entry, i) => (
              <motion.div
                key={entry.time}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-4 rounded-2xl border ${entry.bg} flex items-center justify-between shadow-soft-sm`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-soft-sm">
                    {entry.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-charcoal-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.time}
                    </div>
                    <div className="text-sm font-bold text-charcoal-900 mt-0.5">
                      {entry.items.join(' • ')}
                    </div>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          {/* Right Updated Nutrition Card */}
          <div className="lg:col-span-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-warmBg p-6 sm:p-8 rounded-2xl border border-warmBg-border shadow-soft space-y-6"
            >
              <div className="flex items-center justify-between border-b border-warmBg-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-600 animate-spin" />
                  <span className="font-display font-extrabold text-base text-charcoal-900">
                    Today's Nutrition Updated
                  </span>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                  Live Adaptive
                </span>
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-warmBg-border shadow-soft-sm">
                  <div className="text-xs font-bold text-charcoal-500">Calories</div>
                  <div className="font-display font-extrabold text-xl text-charcoal-900 mt-1">
                    1,780 <span className="text-xs font-normal text-charcoal-500">/ 2,100 kcal</span>
                  </div>
                  <div className="w-full bg-sage-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-warmBg-border shadow-soft-sm">
                  <div className="text-xs font-bold text-charcoal-500">Protein</div>
                  <div className="font-display font-extrabold text-xl text-charcoal-900 mt-1">
                    62g <span className="text-xs font-normal text-charcoal-500">/ 80g</span>
                  </div>
                  <div className="w-full bg-sage-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-brand-600 h-full rounded-full" style={{ width: '77%' }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-warmBg-border shadow-soft-sm">
                  <div className="text-xs font-bold text-charcoal-500">Carbs</div>
                  <div className="font-display font-extrabold text-xl text-charcoal-900 mt-1">
                    210g <span className="text-xs font-normal text-charcoal-500">/ 260g</span>
                  </div>
                  <div className="w-full bg-sage-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-warmBg-border shadow-soft-sm">
                  <div className="text-xs font-bold text-charcoal-500">Fat</div>
                  <div className="font-display font-extrabold text-xl text-charcoal-900 mt-1">
                    48g <span className="text-xs font-normal text-charcoal-500">/ 60g</span>
                  </div>
                  <div className="w-full bg-sage-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-warmBg-border text-xs text-charcoal-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Dinner Recommendation adjusted for light high-protein options.</span>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
