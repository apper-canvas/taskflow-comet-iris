/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5'
        },
        secondary: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706'
        },
        accent: '#10b981',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      textColor: {
        'primary-text': '#1e293b',
        'secondary-text': '#475569',
        'muted-text': '#64748b',
        'light-text': '#f8fafc',
        'dark-primary': '#f1f5f9',
        'dark-secondary': '#cbd5e1',
        'dark-muted': '#94a3b8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  safelist: [
    'text-primary-text',
    'text-secondary-text', 
    'text-muted-text',
    'text-readable',
    'text-readable-primary',
    'text-readable-secondary',
    'text-readable-muted',
    'text-readable-light',
    'text-readable-inverse',
    'text-surface-readable',
    'text-surface-muted',
    'text-surface-900',
    'text-surface-800',
    'text-surface-700',
    'text-surface-600',
    'text-surface-500',
    'text-surface-400',
    'text-surface-300',
    'text-surface-200',
    'text-surface-100',
    'text-white',
    'form-input',
    'btn-text-primary',
    'btn-text-secondary',
    'text-primary-600',
    'text-secondary-600',
    'text-green-600',
    'text-blue-600'
  ],
  plugins: []
}