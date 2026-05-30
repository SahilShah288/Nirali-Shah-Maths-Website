/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ghost: "#f8fafc",
        midnight: "#0f172a",
        cerulean: "#3b82f6",
        maths: {
          navy: "#0f172a",
          blue: "#3b82f6",
          sky: "#3b82f6",
          pale: "#f1f5f9",
          mist: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      lineHeight: {
        relaxed: "1.6",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.65s ease-out forwards",
      },
    },
  },
  plugins: [],
};
