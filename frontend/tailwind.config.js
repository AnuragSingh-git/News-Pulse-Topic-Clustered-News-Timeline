/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        wire: {
          bg: '#14171D',
          panel: '#1C2029',
          card: '#20242D',
          line: '#2A2F3A',
          ink: '#E9E6DD',
          dim: '#9A9A93',
          amber: '#E8A33D',
          teal: '#5FB8AE',
          red: '#C4553F',
        },
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
