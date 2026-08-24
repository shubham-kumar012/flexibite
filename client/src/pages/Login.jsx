import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { ArrowLeft, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, token } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check URL query parameters for Google OAuth errors
  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      if (errParam === 'google_cancelled') {
        setError('Google sign-in was cancelled.');
      } else if (errParam === 'google_not_configured') {
        setError('Google OAuth is not configured on server.');
      } else {
        setError('Unable to sign in with Google. Please try again.');
      }
    }
  }, [searchParams]);

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
        navigate('/dashboard', { replace: true });
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
      <div className="max-w-md mx-auto w-full my-12 bg-white p-8 sm:p-10 rounded-2xl border border-warmBg-border shadow-floating space-y-6">

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

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-warmBg-border w-full"></div>
          <span className="bg-white px-3 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider shrink-0">
            OR
          </span>
          <div className="border-t border-warmBg-border w-full"></div>
        </div>

        {/* Google OAuth Button */}
        <a
          href={`${APP_CONFIG.apiBaseUrl}/auth/google`}
          className="w-full py-2.5 px-4 rounded-xl border border-warmBg-border bg-white hover:bg-warmBg text-charcoal-800 text-xs font-bold transition-all flex items-center justify-center gap-2.5 shadow-soft-sm"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </a>

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
