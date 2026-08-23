import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function FoodSearch({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Keep internal state in sync if parent value changes externally
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Debounce API update by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, value, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search foods (e.g. dal, paneer, parantha)..."
        className="w-full pl-10 pr-10 py-3 bg-white border border-warmBg-border rounded-xl text-sm font-medium text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-soft-sm transition-all"
        aria-label="Search foods"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-400 hover:text-charcoal-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
