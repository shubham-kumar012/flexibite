import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../config/appConfig';
import { ArrowLeft, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Demo Login submitted for: ${email}`);
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

      {/* Main Login Form Container */}
      <div className="max-w-md mx-auto w-full my-12 bg-white p-8 sm:p-10 rounded-3xl border border-warmBg-border shadow-floating space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-charcoal-900">
            Log in to {APP_CONFIG.name}
          </h1>
          <p className="text-xs text-charcoal-600">
            Continue tracking your meals with natural Indian portion sizes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-charcoal-800">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to demo user!"); }} className="text-xs font-semibold text-brand-700 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-warmBg border border-warmBg-border focus:border-brand-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-soft hover:shadow-floating transition-all"
          >
            Log In
          </button>
        </form>

        <div className="pt-4 border-t border-warmBg-border text-center text-xs text-charcoal-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-brand-700 hover:underline">
            Sign up for free
          </Link>
        </div>

      </div>

      {/* Footer minimal disclaimer */}
      <div className="text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.
      </div>
    </div>
  );
}
