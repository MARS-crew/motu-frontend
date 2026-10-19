const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      boxShadow: {
        'listing-panel': '0px 4px 6px rgba(0, 0, 0, 0.06)',
      },
      fontSize: {
        topbar: '17px',
      },
      // 공통 색상·폰트는 여기에 등록합니다.
      colors: {
        'motu-black': '#2E3138',
        'motu-text-primary': '#191F28',
        'motu-text-secondary': '#4E5968',
        'motu-bg': '#F2F4F6',
        'motu-bg-secondary': '#EDEFF2',
        'motu-option-selected': '#F4F4F5',
        'motu-calendar-blue': '#3182F6',
        'motu-tonal': '#D9DDE3',
        'motu-text-tertiary': '#8B95A1',
        'motu-red': '#F04452',
        'motu-red-light': '#FDECEE',
        'motu-blue': '#2175F3',
        'motu-grey': '#8B8E96',
        'motu-grey-light': '#BEBFC1',
        'motu-grey-lighter': '#EAEAEB',
        'motu-grey-chip': '#E8ECF0',
        'motu-border': '#E5E8EB',
        'motu-disabled': '#B0B8C1',
        'motu-green': '#0E9F6E',
        'motu-slate': '#6B7280',
        'motu-brown': '#B28A6B',
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
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-no-font-padding': { '-rn-include-font-padding': 'false' },
        '.text-vertical-center': { '-rn-text-align-vertical': 'center' },
        '.text-vertical-top': { '-rn-text-align-vertical': 'top' },
      });
    }),
  ],
};
