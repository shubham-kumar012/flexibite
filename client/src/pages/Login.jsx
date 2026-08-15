import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { ArrowLeft, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, user, token } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper function to check onboarding completion & redirect accordingly
  const checkOnboardingAndRedirect = async (authToken) => {
    const activeToken = authToken || token || localStorage.getItem('token');
    if (!activeToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${APP_CONFIG.apiBaseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success && data.profileCompleted) {
        navigate('/profile', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      console.error('Error checking profile status during login redirect:', err);
      navigate('/onboarding', { replace: true });
    }
  };

  // If user is already authenticated when visiting /login page
  useEffect(() => {
    if (user && token) {
      checkOnboardingAndRedirect(token);
    }
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      const currentToken = localStorage.getItem('token');
      await checkOnboardingAndRedirect(currentToken);
    } else {
      setSubmitting(false);
      setError(result.message || 'Invalid email or password');
    }
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

        {/* Display Error Banner if error exists */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
            disabled={submitting}
            className="w-full py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-soft hover:shadow-floating transition-all disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Log In'}
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
