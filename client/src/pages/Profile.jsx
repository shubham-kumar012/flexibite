import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { User as UserIcon, Mail, LogOut, Sparkles, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warmBg flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header Navigation */}
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

      {/* Profile Container */}
      <div className="max-w-md mx-auto w-full my-12 bg-white p-8 sm:p-10 rounded-3xl border border-warmBg-border shadow-floating space-y-6">
        
        {/* Title & Welcome */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>User Account</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-charcoal-900">
            Profile
          </h1>
          <h2 className="text-lg font-bold text-brand-700">
            Welcome, {user?.name || 'User'}
          </h2>
          <p className="text-sm font-medium text-charcoal-600 bg-sage-100/60 p-3 rounded-xl border border-sage-200/60">
            Your profile will be completed in the next step.
          </p>
        </div>

        {/* User Info Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
            <div className="p-2 bg-white rounded-lg text-brand-600 shadow-soft-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-charcoal-400">Name</span>
              <span className="text-sm font-bold text-charcoal-800">{user?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-warmBg rounded-xl border border-warmBg-border">
            <div className="p-2 bg-white rounded-lg text-brand-600 shadow-soft-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-semibold text-charcoal-400">Email</span>
              <span className="text-sm font-bold text-charcoal-800">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-warmBg-border">
          <button
            onClick={handleLogout}
            className="w-full py-3 text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.
      </div>
    </div>
  );
}
