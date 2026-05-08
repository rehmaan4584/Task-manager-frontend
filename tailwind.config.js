/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      keyframes: {
        "toast-in": {
          from: { opacity: "0", transform: "translateY(-10px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.35s ease-out forwards",
      },
      boxShadow: {
        premium:
          "0 0 0 1px rgba(255,255,255,0.06), 0 25px 50px -12px rgba(0,0,0,0.5)",
        glow: "0 0 40px -10px rgba(245, 158, 11, 0.35)",
      },
    },
  },
  plugins: [],
}