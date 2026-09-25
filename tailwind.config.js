/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        playstation: {
          blue: '#00439c',
          lightBlue: '#0070d1',
          accent: '#006fee',
          navy: '#0b192c',
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        cardHover: '0 12px 30px -4px rgba(0, 67, 156, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        modal: '0 20px 40px -15px rgba(15, 23, 42, 0.25)'
      }
    },
  },
  plugins: [],
}
