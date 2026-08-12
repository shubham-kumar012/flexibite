import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-warmBg-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-soft p-1.5 border border-warmBg-border/80 group-hover:scale-105 transition-transform">
              <img 
                src={APP_CONFIG.logoUrl} 
                alt={`${APP_CONFIG.name} Logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display font-extrabold text-xl text-charcoal-900 tracking-tight group-hover:text-brand-600 transition-colors">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Center: Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {APP_CONFIG.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-charcoal-600 hover:text-brand-600 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate(APP_CONFIG.routes.profile)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-800 bg-white border border-warmBg-border px-4 py-2 rounded-xl shadow-soft-sm hover:border-brand-300 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-brand-600" />
                  <span>{user.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(APP_CONFIG.routes.login)}
                  className="text-sm font-semibold text-charcoal-700 hover:text-brand-700 px-4 py-2 rounded-lg hover:bg-sage-100/60 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate(APP_CONFIG.routes.login)}
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 px-5 py-2.5 rounded-xl shadow-soft hover:shadow-floating hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            {user ? (
              <button
                onClick={() => navigate(APP_CONFIG.routes.profile)}
                className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
              >
                {user.name}
              </button>
            ) : (
              <button
                onClick={() => navigate(APP_CONFIG.routes.login)}
                className="text-xs font-semibold text-white bg-brand-600 px-3.5 py-2 rounded-lg shadow-soft"
              >
                Get Started
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-sage-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-warmBg-border px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {APP_CONFIG.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 rounded-lg text-base font-medium text-charcoal-800 hover:bg-sage-100 hover:text-brand-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-warmBg-border/80 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(APP_CONFIG.routes.profile);
                  }}
                  className="w-full text-center py-2.5 text-base font-semibold text-charcoal-800 bg-white border border-warmBg-border rounded-xl shadow-soft-sm"
                >
                  My Profile ({user.name})
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 text-base font-semibold text-rose-700 bg-rose-50 rounded-xl"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(APP_CONFIG.routes.login);
                  }}
                  className="w-full text-center py-2.5 text-base font-semibold text-charcoal-800 bg-white border border-warmBg-border rounded-xl shadow-soft-sm"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(APP_CONFIG.routes.login);
                  }}
                  className="w-full text-center py-2.5 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-soft"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
