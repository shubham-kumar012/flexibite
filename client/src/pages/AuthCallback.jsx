import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../config/appConfig';

/**
 * AuthCallback Page
 * 
 * Handles the backend OAuth redirect callback (`/auth/callback?token=...&redirectTo=...`).
 * Reads the generated FlexiBite JWT token, stores it in localStorage, and navigates
 * the user to either onboarding or dashboard.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      // Store standard FlexiBite JWT token in localStorage
      localStorage.setItem('token', token);

      // Force a full window location redirect so AuthContext initializes cleanly with the new token
      window.location.href = redirectTo;
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-warmBg flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      <div>
        <h2 className="font-display font-bold text-lg text-charcoal-900">
          Signing you in with Google...
        </h2>
        <p className="text-xs text-charcoal-500 mt-1 font-medium">
          Setting up your FlexiBite session.
        </p>
      </div>
    </div>
  );
}
