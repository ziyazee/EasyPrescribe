/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#1f7a5c",
        "primary-hover": "#165942",
        "primary-light": "#e0f2ec",
        "background-light": "#f6f8f7",
        "background-dark": "#131f1b",
        "neutral-border": "#dde4e2",
        "text-main": "#121715",
        "text-secondary": "#67837a"
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "serif": ["Georgia", "serif"]
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "primary-glow": "0 0 15px rgba(31, 122, 92, 0.15)"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}