/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      background: {
        polos: "rgba(255, 255, 255, 0.07)",
      },
    },
  },
  plugins: [],
};
