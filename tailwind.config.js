/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'rgb(229, 231, 235)', // gray-300
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};