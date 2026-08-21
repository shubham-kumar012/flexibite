import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Flame, HeartPulse, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export default function Hero() {
  const navigate = useNavigate();

  const handleSeeHowItWorks = () => {
    const el = document.querySelector('#how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Decorative subtle ambient background blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-100/40 via-sage-100/60 to-warmAccent-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{APP_CONFIG.tagline}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.12]">
              Eat naturally. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500">
                Track intelligently.
              </span>
            </h1>

            {/* Supporting USP Paragraphs */}
            <div className="space-y-3 text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl">
              <p>
                You don't have to weigh every meal to understand your nutrition. Estimate your portions using familiar Indian serving sizes—or enter exact quantities when you have them for more accurate results.
              </p>
              <p className="text-charcoal-600 font-medium">
                Whether you're trying to gain weight, lose weight, or simply stay fit, get nutrition insights that fit the way you actually eat.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => navigate(APP_CONFIG.routes.login)}
                className="inline-flex items-center justify-center gap-2.5 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-7 py-3.5 rounded-2xl shadow-soft hover:shadow-floating hover:-translate-y-0.5 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleSeeHowItWorks}
                className="inline-flex items-center justify-center gap-2 text-base font-semibold text-charcoal-800 bg-white hover:bg-sage-50 active:bg-sage-100 border border-warmBg-border px-6 py-3.5 rounded-2xl shadow-soft-sm transition-all"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Micro-Statement */}
            <div className="pt-4 border-t border-warmBg-border/70 space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-bold text-charcoal-900">
                <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>No kitchen scale required. Just tell us what you ate.</span>
              </div>
              <p className="text-xs font-medium text-charcoal-500 tracking-wide pl-6">
                Estimate naturally • Track consistently • Understand your progress
              </p>
            </div>

          </motion.div>

          {/* Right Column: Hero Image with Floating Nutrition Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center"
          >
            {/* Image Container with Organic Frame & Soft Glow */}
            <div className="relative w-full max-w-md lg:max-w-none">

              {/* Outer decorative ring */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-brand-200/50 via-warmAccent-100/40 to-sage-200/50 rounded-2xl blur-lg opacity-80 -z-10" />

              {/* Main Rounded Image Box */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-warmBg-border shadow-soft-xl group">
                <img
                  src={APP_CONFIG.heroImageUrl}
                  alt="Traditional Indian Meal - Thali with Dal, Roti, Rice and Sabzi"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium bg-charcoal-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center justify-between border border-white/10">
                  <span>Authentic Indian Thali & Serving Sizes</span>
                  <span className="text-brand-300 font-semibold">100% Flexible</span>
                </div>
              </div>

              {/* Floating Card 1: 2 Chapatis */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -top-4 -left-4 sm:-left-6 glass-card p-3 sm:p-3.5 rounded-2xl shadow-floating flex items-center gap-3 border border-white/80"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                  🫓
                </div>
                <div>
                  <div className="text-xs font-bold text-charcoal-900">2 Chapatis</div>
                  <div className="text-[11px] font-semibold text-charcoal-600 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>~ 200 kcal</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 2: 1 Bowl Dal */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute top-1/2 -right-4 sm:-right-6 glass-card p-3 sm:p-3.5 rounded-2xl shadow-floating flex items-center gap-3 border border-white/80"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  🍲
                </div>
                <div>
                  <div className="text-xs font-bold text-charcoal-900">1 Bowl Dal</div>
                  <div className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    Protein rich
                  </div>
                </div>
              </motion.div>

              {/* Floating Card 3: Weight Gain Goal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-5 left-8 sm:left-12 glass-card p-3 sm:p-3.5 rounded-2xl shadow-floating flex items-center gap-3 border border-white/80"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">Active Goal</div>
                  <div className="text-xs font-extrabold text-charcoal-900">Weight Gain</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
