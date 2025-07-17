/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'text-primary': '#231917',
        'card-grey': '#E6E6E6',
        'black-custom': '#3D3D3D',
        'bg-light': '#FBFBFB',
        'white-custom': '#FFFFFF',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
