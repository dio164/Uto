/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FDF7F9',
          100: '#FAF0F3',
          200: '#F8E4EA',
          300: '#F3CCD7',
          400: '#DE9EB0',
          500: '#C98598',
          600: '#B06B7E',
          700: '#8E4D60',
          800: '#743F4D',
          900: '#4D2531',
          950: '#2A131A',
        },
        paper: {
          DEFAULT: '#FFF9F2',
          aged: '#FAF3E8',
          border: '#EFE2D3',
          shadow: '#E2D0BE',
        },
        ink: {
          DEFAULT: '#392B30',
          light: '#654F57',
          muted: '#8B737C',
          faint: '#AF99A2',
        },
        rosegold: {
          DEFAULT: '#B77973',
          light: '#D49D97',
          dark: '#935A54',
          foil: '#DCA59F',
        },
        gold: {
          DEFAULT: '#C5A059',
          light: '#E2C27F',
          dark: '#9A7730',
          foil: '#D4AF37',
        }
      },
      fontFamily: {
        blackletter: ['UnifrakturCook', 'UnifrakturMaguntia', 'serif'],
        poem: ['"Cormorant Garamond"', '"IM Fell English"', '"EB Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 20px 50px -10px rgba(68, 38, 48, 0.35), 0 10px 20px -5px rgba(68, 38, 48, 0.2)',
        'book-lg': '0 30px 70px -15px rgba(68, 38, 48, 0.45), 0 15px 30px -5px rgba(68, 38, 48, 0.25)',
        'page': 'inset 0 0 30px rgba(116, 63, 77, 0.05), 0 5px 15px rgba(57, 43, 48, 0.08)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.4)',
        'rose-glow': '0 0 25px rgba(183, 121, 115, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        pulseFaint: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-faint': 'pulseFaint 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
