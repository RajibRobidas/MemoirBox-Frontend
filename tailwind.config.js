/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        accent: '#4F46E5',
        'accent-600': '#4338CA',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        light: '#E5E7EB',
        'secondary-400': '#9CA3AF',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'fast': 'all 0.2s ease-in-out',
        'medium': 'all 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
} 