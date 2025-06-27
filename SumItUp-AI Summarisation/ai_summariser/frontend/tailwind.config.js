/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        ycol : '#E9C46A',
        gcol : '#2A9D8F',
        bcol : '#264653',
        ocol : '#F4A261' ,
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        redhat: ['"Red Hat Display"', 'sans-serif'],
        librecaslon : ['"Libre Caslon Display"','serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}