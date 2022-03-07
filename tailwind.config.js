module.exports = {
  content: [
    './src/**/*.{html,js}',
    './src/*.{html,js}',
  ],
  theme: {
    extend: {
      colors: {
        'body': '#17171F',
        'selected-text': '#A3A3FF',
        'theme': '#3F3FFF',
        'nav': '#404053',//#35323B
        'secondary': '#9191A4',
        'badge': '#3F3F51',
        'input-border': '#565666',
        'input': '#2A2A35',
      },
      fontFamily: {
        'poppins': ["'Poppins'", 'sans-serif']
      },
      visibility: ["group-hover"],
    },
  },
  plugins: [],
}