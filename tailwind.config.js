// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { //Кремовый
          DEFAULT: '#FFFBEB',
          dark: '#E6C7B4',
        },
        beige: { //Бежевый
          light: '#C9A97F',
          DEFAULT: '#A2845E',
          dark: '#9B7857',
        },
        red: {
          light: '#FFC1C1',
          DEFAULT: '#FF746C',
          dark: '#E56767',
        },
        blue: {
          light: '#C1EFFF',
          DEFAULT: '#8AD9FF',
          dark: '#67BCE5'
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
