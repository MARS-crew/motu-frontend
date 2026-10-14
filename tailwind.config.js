/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 공통 색상·폰트는 여기에 등록합니다.
      colors: {
        'motu-black': '#2E3138',
        'motu-bg': '#F2F4F6',
        'motu-red': '#F04452',
        'motu-blue': '#2175F3',
        'motu-grey': '#8B8E96',
        'motu-grey-light': '#BEBFC1',
        'motu-grey-lighter': '#EAEAEB',
        'motu-grey-chip': '#E8ECF0',
        'motu-green': '#0E9F6E',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
