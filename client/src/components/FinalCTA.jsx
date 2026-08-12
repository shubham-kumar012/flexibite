import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-warmBg to-sage-100/50 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 sm:p-14 rounded-4xl border border-warmBg-border shadow-floating space-y-6 relative"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Start Your Journey Today</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight leading-tight">
            Ready to make nutrition simpler?
          </h2>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl font-medium text-charcoal-700 max-w-2xl mx-auto leading-relaxed">
            Stop obsessing over every gram. Start understanding what you eat.
          </p>

          {/* CTA Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate(APP_CONFIG.routes.login)}
              className="inline-flex items-center justify-center gap-3 text-base sm:text-lg font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-8 py-4 rounded-2xl shadow-soft hover:shadow-floating hover:-translate-y-0.5 transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs font-medium text-charcoal-500 pt-2">
            No credit card required • Free trial available • Natural Indian portion estimates
          </p>
        </motion.div>

      </div>
    </section>
  );
}
