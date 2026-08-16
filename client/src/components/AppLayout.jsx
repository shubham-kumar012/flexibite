import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Apple,
  Target,
  TrendingUp,
  User as UserIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: 'Nutrition Plan',
      path: '/nutrition-plan',
      icon: ClipboardList,
      active: true,
    },
    {
      label: "Today's Diet",
      path: '#',
      icon: Utensils,
      active: false,
      badge: 'Soon',
    },
    {
      label: 'Foods',
      path: '#',
      icon: Apple,
      active: false,
      badge: 'Soon',
    },
    {
      label: 'Goals',
      path: '#',
      icon: Target,
      active: false,
      badge: 'Soon',
    },
    {
      label: 'Progress',
      path: '#',
      icon: TrendingUp,
      active: false,
      badge: 'Soon',
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: UserIcon,
      active: true,
    },
    {
      label: 'Settings',
      path: '#',
      icon: Settings,
      active: false,
      badge: 'Soon',
    },
  ];

  return (
    <div className="min-h-screen bg-warmBg flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-warmBg-border shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto justify-between p-4 shadow-soft-sm">
        <div className="space-y-6">
          {/* Brand Logo & Name */}
          <Link to="/dashboard" className="flex items-center gap-3 px-2 py-1 group">
            <div className="w-9 h-9 rounded-xl bg-white shadow-soft p-1.5 border border-warmBg-border flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={APP_CONFIG.logoUrl}
                alt={APP_CONFIG.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-charcoal-900 tracking-tight block">
                {APP_CONFIG.name}
              </span>
              <span className="text-[10px] font-bold text-brand-700 tracking-wide block uppercase">
                Plant-Forward Wellness
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = location.pathname === item.path;

              if (item.active) {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-soft-sm'
                        : 'text-charcoal-700 hover:bg-warmBg hover:text-brand-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isCurrent ? 'text-brand-600' : 'text-charcoal-500'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-charcoal-400 cursor-not-allowed opacity-70 select-none"
                  title="Feature coming soon"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-charcoal-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-warmBg-muted text-charcoal-500 border border-warmBg-border">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout at Bottom */}
        <div className="pt-4 border-t border-warmBg-border space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-warmBg border border-warmBg-border">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-charcoal-900 truncate">
                {user?.name || 'User'}
              </span>
              <span className="block text-[11px] text-charcoal-500 truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b border-warmBg-border sticky top-0 z-30 shadow-soft-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img src={APP_CONFIG.logoUrl} alt={APP_CONFIG.name} className="w-8 h-8 object-contain" />
            <span className="font-display font-extrabold text-lg text-charcoal-900">{APP_CONFIG.name}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-charcoal-700 hover:bg-warmBg border border-warmBg-border transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="px-4 pb-6 pt-2 bg-white border-b border-warmBg-border space-y-3 animate-fadeIn">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = location.pathname === item.path;

                if (item.active) {
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isCurrent
                          ? 'bg-brand-50 text-brand-700 border border-brand-200'
                          : 'text-charcoal-800 hover:bg-warmBg'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-brand-600' : 'text-charcoal-500'}`} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal-400 opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-charcoal-300" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-warmBg-muted text-charcoal-500 border border-warmBg-border">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-warmBg-border flex items-center justify-between">
              <div className="text-xs">
                <span className="block font-bold text-charcoal-900">{user?.name}</span>
                <span className="block text-[11px] text-charcoal-500">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-between overflow-x-hidden min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>

        {/* FOOTER */}
        <footer className="bg-white border-t border-warmBg-border py-4 px-6 text-center text-xs text-charcoal-500">
          <p className="max-w-3xl mx-auto text-[11px] text-charcoal-400">
            ℹ️ Nutrition targets are starting estimates for general wellness and may not account for individual medical conditions.
          </p>
          <p className="mt-1 font-medium">© {new Date().getFullYear()} {APP_CONFIG.name}. Simple Indian Nutrition Tracking.</p>
        </footer>
      </main>
    </div>
  );
}
