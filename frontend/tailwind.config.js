/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        posis: {
          blue: '#1F3F94',
          'blue-dark': '#142966',
          'blue-light': '#2E58C4',
          gold: '#F2B705',
          'gold-hover': '#DBA300',
          'gold-light': '#FEF3C7',
          bone: '#F7F5EE',
          'bone-card': '#FFFFFF',
          ink: '#0F1B3D',
          'ink-muted': '#4A5568',
          'ink-light': '#718096',
          border: '#D8D4C7',
          'border-strong': '#1F3F94',
          // Functional status colors
          lost: '#DC2626',
          found: '#15803D',
          process: '#D97706',
          done: '#4B5563',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Geist Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
      },
      boxShadow: {
        'editorial': '4px 4px 0px 0px #1F3F94',
        'editorial-gold': '4px 4px 0px 0px #F2B705',
        'editorial-dark': '4px 4px 0px 0px #0F1B3D',
        'editorial-sm': '2px 2px 0px 0px #1F3F94',
      }
    },
  },
  plugins: [],
}
