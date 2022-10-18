const plugin = require('tailwindcss/plugin');


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
        'slide-up': {
          '0%': {transform: 'translate3d(0, 100%, 0)'},
          '100%': {transform: 'translate3d(0, 0%, 0)'}
        },
        'slide-down': {
          '0%': {transform: 'translate3d(0, -100%, 0)'},
          '100%': {transform: 'translate3d(0, 0%, 0)'}
        },
        'toast-hide': {
          '0%': {opacity: 1},
          '100%': {opacity: 0}
        }
      },
      animation: {
        'slide-in-up': 'slide-up 1s forwards',
        'slide-in-down': 'slide-down 0.6s cubic-bezier(0, 0.9, 0.15, 1) forwards',
        'toast-hide': 'toast-hide 0.3s ease-in forwards'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    plugin(({addVariant}) => {
      addVariant('toast-closed', '&[data-state="closed"]')
    })
  ],
}
