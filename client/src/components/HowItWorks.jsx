import React from 'react';
import { motion } from 'framer-motion';
import { Target, UtensilsCrossed, LineChart, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Set Your Goal',
      description: 'Define what you want to achieve with clear calorie and macronutrient guidance tailored for your lifestyle.',
      icon: Target,
      tags: ['Gain Weight', 'Lose Weight', 'Maintain Weight', 'Stay Fit'],
      accentBg: 'bg-brand-50 border-brand-200/80 text-brand-700',
    },
    {
      step: '02',
      title: 'Tell Us What You Ate',
      description: 'Log meals using intuitive Indian household measurements or precise grams when you know them.',
      icon: UtensilsCrossed,
      tags: ['Roti', 'Katori Dal', 'Bowl Sabzi', 'Glass Milk', 'Cup Chai', 'Piece / Spoon'],
      accentBg: 'bg-warmAccent-50 border-warmAccent-200 text-warmAccent-700',
    },
    {
      step: '03',
      title: 'Get Your Personalized Plan',
      description: 'Receive real-time nutrition breakdown and smart meal suggestions tailored to your remaining targets.',
      icon: LineChart,
      tags: ['Remaining Targets', 'Dietary Preference', 'Smart Recommendations', 'Weekly Insights'],
      accentBg: 'bg-sage-100/70 border-sage-200 text-brand-800',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-warmBg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Three simple steps to understand your nutrition.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            No complex calculations, no rigid diet rules. Just clear insight into what your body needs.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-3xl border border-warmBg-border shadow-soft flex flex-col justify-between relative overflow-hidden group hover:shadow-floating transition-all duration-300"
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/60 text-brand-700 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-brand-600" />
                  </div>
                  <span className="font-display font-extrabold text-3xl text-sage-300 group-hover:text-brand-500 transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-display text-xl font-extrabold text-charcoal-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Micro Pill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-warmBg-border/60">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-sage-50 border border-sage-200/60 text-[11px] font-semibold text-charcoal-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
