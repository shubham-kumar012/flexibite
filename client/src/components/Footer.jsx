import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../config/appConfig';
import { Heart, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-charcoal-900 text-white pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center">
                <img src={APP_CONFIG.logoUrl} alt={APP_CONFIG.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                {APP_CONFIG.name}
              </span>
            </Link>

            <p className="text-sm text-charcoal-300 leading-relaxed max-w-sm">
              Simple nutrition tracking designed around the way you actually eat. No kitchen scale required.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-charcoal-800 hover:bg-brand-600 flex items-center justify-center text-charcoal-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-charcoal-800 hover:bg-brand-600 flex items-center justify-center text-charcoal-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-charcoal-800 hover:bg-brand-600 flex items-center justify-center text-charcoal-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-charcoal-800 hover:bg-brand-600 flex items-center justify-center text-charcoal-300 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal-200">Product</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              {APP_CONFIG.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-brand-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-charcoal-200">Legal & Support</h4>
            <ul className="space-y-2 text-sm text-charcoal-400">
              <li>
                <a href="#privacy" className="hover:text-brand-300 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-brand-300 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-300 transition-colors">Contact Support</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <div>
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved. Designed for Indian eating habits.
          </div>
          <div className="flex items-center gap-1 text-charcoal-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for health & wellness</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
