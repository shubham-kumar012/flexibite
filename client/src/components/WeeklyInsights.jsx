import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function WeeklyInsights() {
  const nutrients = [
    { name: 'Protein', percentage: 78, status: 'Needs Attention', color: 'bg-amber-500' },
    { name: 'Fiber', percentage: 91, status: 'Optimal', color: 'bg-brand-600' },
    { name: 'Calcium', percentage: 54, status: 'Could Improve', color: 'bg-amber-600' },
  ];

  const insights = [
    {
      title: 'Protein needs attention',
      description: 'Your average protein intake has been slightly below your target this week. Consider adding more paneer, dal, or sprouts to your lunches.',
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-200/80 text-amber-900',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Fiber looks good',
      description: 'You are consistently meeting your daily fiber target through whole grains and vegetable sabzis. Excellent consistency!',
      icon: CheckCircle,
      bg: 'bg-emerald-50 border-emerald-200/80 text-emerald-900',
      iconColor: 'text-brand-600',
    },
    {
      title: 'Calcium could improve',
      description: 'Consider adding calcium-rich Indian foods such as curd (dahi), sesame (til), or fortified milk to your daily routine.',
      icon: TrendingUp,
      bg: 'bg-sage-50 border-sage-200/80 text-charcoal-900',
      iconColor: 'text-sage-600',
    },
  ];

  return (
    <section id="nutrition" className="py-16 sm:py-24 bg-warmBg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Trends</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Don't just track today. Understand your week.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            Get clear, educational weekly trends that help you understand nutrient patterns without overwhelming medical jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Left: Weekly Nutrition Analytics Box */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-warmBg-border shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-warmBg-border pb-4">
              <div>
                <h3 className="font-display font-extrabold text-lg text-charcoal-900">Your Weekly Nutrition</h3>
                <p className="text-xs text-charcoal-500 font-medium">Average weekly target completion</p>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                7-Day Overview
              </span>
            </div>

            <div className="space-y-5">
              {nutrients.map((n) => (
                <div key={n.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-charcoal-800">
                    <span>{n.name}</span>
                    <span className="text-charcoal-600">{n.percentage}%</span>
                  </div>
                  <div className="w-full bg-warmBg h-3 rounded-full overflow-hidden p-0.5 border border-warmBg-border">
                    <div
                      className={`h-full ${n.color} rounded-full transition-all duration-500`}
                      style={{ width: `${n.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Educational Insight Cards */}
          <div className="lg:col-span-7 space-y-4">
            {insights.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`p-5 rounded-2xl border ${card.bg} shadow-soft-sm flex items-start gap-4`}
                >
                  <div className={`p-2 rounded-xl bg-white shadow-soft-sm ${card.iconColor} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-charcoal-900">
                      {card.title}
                    </h4>
                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Educational Disclaimer */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-warmBg-border flex items-start gap-3 text-xs text-charcoal-500">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Educational Wellness Note:</strong> FlexiBite provides general dietary education and wellness insights based on logged meals. It does not provide medical diagnoses or replace professional medical advice.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
