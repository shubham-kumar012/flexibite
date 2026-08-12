/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f9f5',
          100: '#e1f2e7',
          200: '#c4e5d1',
          300: '#98d2b2',
          400: '#64b88d',
          500: '#389b6b',
          600: '#2d6a4f', // primary green accent
          700: '#21543f',
          800: '#1b4332',
          900: '#15372a',
          950: '#0a1f18',
        },
        sage: {
          50: '#f6f8f6',
          100: '#ebf0ec',
          200: '#d7e1d9',
          300: '#b8cabb',
          400: '#92aa96',
          500: '#728d77',
          600: '#59715e',
          700: '#475a4b',
          800: '#3c493e',
          900: '#333e35',
        },
        warmBg: {
          DEFAULT: '#FAF9F5',
          card: '#FFFFFF',
          muted: '#F4F2EB',
          border: '#E8E5DA',
        },
        charcoal: {
          50: '#f6f6f7',
          100: '#e2e3e5',
          200: '#c5c7cb',
          300: '#9f9ea6',
          400: '#72747e',
          500: '#565761',
          600: '#43444d',
          700: '#34353d',
          800: '#25262c',
          900: '#1c1d22', // primary text
        },
        warmAccent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(28, 29, 34, 0.04), 0 1px 4px -1px rgba(28, 29, 34, 0.02)',
        'soft': '0 8px 30px -6px rgba(28, 29, 34, 0.06), 0 4px 12px -2px rgba(28, 29, 34, 0.03)',
        'soft-xl': '0 20px 40px -12px rgba(28, 29, 34, 0.08), 0 8px 16px -4px rgba(28, 29, 34, 0.03)',
        'floating': '0 12px 32px -8px rgba(45, 106, 79, 0.12), 0 4px 12px -2px rgba(28, 29, 34, 0.05)',
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
