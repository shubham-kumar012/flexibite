import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Check } from 'lucide-react';

export default function GoalsSection() {
  const [activeTab, setActiveTab] = useState('gain');

  const goals = [
    {
      id: 'gain',
      title: 'Gain Weight',
      subtitle: 'Build toward a healthy calorie surplus.',
      description: 'Focus on nutrient-dense Indian meals with healthy fats and complex carbs for clean mass gain.',
      icon: TrendingUp,
      targetKcal: 2400,
      consumedKcal: 1720,
      remainingKcal: 680,
      protein: '75g / 90g',
      carbs: '220g / 290g',
      fat: '45g / 65g',
      accentColor: 'border-brand-500 text-brand-700 bg-brand-50',
      progressPercent: 71,
    },
    {
      id: 'lose',
      title: 'Lose Weight',
      subtitle: 'Create a sustainable calorie deficit while keeping nutrition balanced.',
      description: 'Enjoy high-fiber rotis, protein-packed dals, and vegetable sabzis without extreme restriction.',
      icon: TrendingDown,
      targetKcal: 1800,
      consumedKcal: 1350,
      remainingKcal: 450,
      protein: '65g / 80g',
      carbs: '160g / 200g',
      fat: '35g / 45g',
      accentColor: 'border-amber-500 text-amber-700 bg-amber-50',
      progressPercent: 75,
    },
    {
      id: 'fit',
      title: 'Stay Fit',
      subtitle: 'Maintain your routine with balanced nutrition and consistent tracking.',
      description: 'Maintain steady energy levels and support active fitness goals with flexible daily tracking.',
      icon: Activity,
      targetKcal: 2100,
      consumedKcal: 1600,
      remainingKcal: 500,
      protein: '70g / 85g',
      carbs: '200g / 250g',
      fat: '40g / 55g',
      accentColor: 'border-emerald-500 text-emerald-700 bg-emerald-50',
      progressPercent: 76,
    },
  ];

  const currentGoal = goals.find((g) => g.id === activeTab) || goals[0];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-y border-warmBg-border/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <span>Goal-Based Guidance</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Tailored nutrition for your personal objective.
          </h2>
          <p className="text-base sm:text-lg text-charcoal-600">
            Select your primary goal to see how FlexiBite adapts your daily targets automatically.
          </p>
        </div>

        {/* Goal Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isActive = activeTab === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setActiveTab(goal.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border ${isActive
                    ? 'bg-brand-600 text-white border-brand-600 shadow-soft-sm'
                    : 'bg-warmBg text-charcoal-700 border-warmBg-border hover:border-brand-300'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-600'}`} />
                <span>{goal.title}</span>
              </button>
            );
          })}
        </div>

        {/* Goal Preview Card */}
        <motion.div
          key={currentGoal.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto bg-warmBg p-6 sm:p-10 rounded-2xl border border-warmBg-border shadow-soft grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          {/* Left info */}
          <div className="md:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-warmBg-border text-xs font-bold text-charcoal-800">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
              <span>{currentGoal.title} Mode</span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-charcoal-900">
              {currentGoal.subtitle}
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              {currentGoal.description}
            </p>

            <ul className="space-y-2 pt-2 text-xs sm:text-sm font-medium text-charcoal-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>Calculated based on your Indian meal logging history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600" />
                <span>Adjusts automatically if you eat more or less than planned</span>
              </li>
            </ul>
          </div>

          {/* Right Sample UI Box */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-warmBg-border shadow-soft-sm space-y-6">
            <div className="flex items-center justify-between border-b border-warmBg-border pb-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Today's Target</span>
                <div className="font-display font-extrabold text-2xl text-charcoal-900">
                  {currentGoal.targetKcal.toLocaleString()} <span className="text-xs text-charcoal-500 font-medium">kcal</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                  {currentGoal.remainingKcal} kcal remaining
                </span>
              </div>
            </div>

            {/* Calorie Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-charcoal-700">
                <span>Consumed: {currentGoal.consumedKcal.toLocaleString()} kcal</span>
                <span>{currentGoal.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-sage-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentGoal.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Macro Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-warmBg border border-warmBg-border">
                <div className="text-[10px] uppercase font-bold text-charcoal-500">Protein</div>
                <div className="text-xs font-extrabold text-charcoal-900 mt-0.5">{currentGoal.protein}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-warmBg border border-warmBg-border">
                <div className="text-[10px] uppercase font-bold text-charcoal-500">Carbs</div>
                <div className="text-xs font-extrabold text-charcoal-900 mt-0.5">{currentGoal.carbs}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-warmBg border border-warmBg-border">
                <div className="text-[10px] uppercase font-bold text-charcoal-500">Fat</div>
                <div className="text-xs font-extrabold text-charcoal-900 mt-0.5">{currentGoal.fat}</div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
