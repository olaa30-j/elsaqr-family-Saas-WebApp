/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2F80A2",
        secondary: "#B09B85",
        accent: "#92C4D0",
        dark: "#937457",

        "color-2": "#0c0a09",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      fontSize: {
        'responsive-sm': 'clamp(0.8rem, 3vw, 1rem)',
        'responsive-base': 'clamp(1rem, 4vw, 1.2rem)',
        'responsive-lg': 'clamp(1.2rem, 5vw, 1.5rem)',
        'responsive-xl': 'clamp(1.5rem, 6vw, 2rem)',
        'responsive-2xl': 'clamp(2rem, 7vw, 3rem)',
      }
    },
  },
  plugins: [],
}