/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        accent: "#D4AF37",
        secondary: "#555555",
        muted: "#F9F9F7",
        border: "#EAEAEA",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.06)",
        luxury: "0 10px 40px rgba(0,0,0,0.08)",
      },
      transitionDuration: {
        300: "300ms",
      },
    },
  },
  plugins: [],
}
