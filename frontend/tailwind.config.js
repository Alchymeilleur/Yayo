/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#FF8A00',
        success: '#1EA61A',
        danger: '#E74C3C',
        warning: '#F39C12',
        info: '#3498DB',
        light: '#ECF0F1',
        dark: '#2C3E50',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0052CC 0%, #003D99 100%)',
      },
    },
  },
  plugins: [],
};
