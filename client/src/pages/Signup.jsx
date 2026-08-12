import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/appConfig';
import { ArrowLeft, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account created for: ${name} (${email})! Navigating to login...`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warmBg flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header Link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-700 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <img src={APP_CONFIG.logoUrl} alt={APP_CONFIG.name} className="w-8 h-8 object-contain" />
          <span className="font-display font-extrabold text-lg text-charcoal-900">{APP_CONFIG.name}</span>
        </div>
      </div>

      {/* Main Signup Form Container */}
      <div className="max-w-md mx-auto w-full my-12 bg-white p-8 sm:p-10 rounded-3xl border border-warmBg-border shadow-floating space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Your Account</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-charcoal-900">
            Get Started with {APP_CONFIG.name}
          </h1>
          <p className="text-xs text-charcoal-600">
            No kitchen scale needed. Track Indian meals naturally.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs text-charcoal-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Free 14-day trial with full access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Cancel anytime without commitment</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-soft hover:shadow-floating transition-all"
          >
            Create Free Account
          </button>
        </form>

        <div className="pt-4 border-t border-warmBg-border text-center text-xs text-charcoal-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            Log in here
          </Link>
        </div>

      </div>

      <div className="text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.
      </div>
    </div>
  );
}
