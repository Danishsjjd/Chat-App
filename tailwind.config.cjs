/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],

  daisyui: {
    styled: true,
    themes: "dark",
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
