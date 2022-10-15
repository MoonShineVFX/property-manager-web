module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        'eli': [
          '0 8px 8px rgba(0, 0, 0, 0.15)',
          '0 28px 28px rgba(0, 0, 0, 0.15)'
        ]
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translate3d(0, 100%, 0)' },
          '100%': { transform: 'translate3d(0, 0%, 0)' }
        }
      },
      animation: {
        'slide-in': 'slide 1s forwards'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
