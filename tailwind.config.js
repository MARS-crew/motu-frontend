/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontSize: {
        topbar: '17px',
      },
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
        'motu-btn-red': '#E5484D',
      },
      fontFamily: {
        pretendard: ['Pretendard-Regular'],
        'pretendard-medium': ['Pretendard-Medium'],
        'pretendard-semibold': ['Pretendard-SemiBold'],
        'pretendard-bold': ['Pretendard-Bold'],
      },
    },
  },
  plugins: [],
};
