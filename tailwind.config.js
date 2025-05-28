/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        colors: {
          primary: {
            DEFAULT: '#8B5CF6', // violet-500
            light: '#A78BFA',   // violet-400
            dark: '#7C3AED',    // violet-600
          },
          secondary: {
            DEFAULT: '#4B5563', // gray-600
            light: '#6B7280',   // gray-500
            dark: '#374151',    // gray-700
          },
          accent: {
            DEFAULT: '#F59E0B', // amber-500
            light: '#FACC15',   // amber-400
            dark: '#D97706',    // amber-600
          },
        },
        fontSize: {
          'h1' : ['2.5rem', {
            lineHeight: '3rem',
            fontWeight: '700',
          }],
          'h2' : ['2rem', {
            lineHeight: '2.5rem',
            fontWeight: '600',
          }],
          'h3' : ['1.5rem', {
            lineHeight: '2rem',
            fontWeight: '600',
          }],
          'h4' : ['1.25rem', {
            lineHeight: '1.75rem',
            fontWeight: '400',
          }],
          'h5' : ['1rem', {
            lineHeight: '1.5rem',
            fontWeight: '400',
          }],
        }
    },
  },
  plugins: [],
};