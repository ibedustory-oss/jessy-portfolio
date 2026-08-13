import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF9F6',
        ink: '#161513',
        charcoal: '#2B2A27',
        warmgray: '#8B867D',
        line: '#DDD9D1',
        accent: '#B4512B',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Apple SD Gothic Neo',
          'Noto Sans JP',
          'Noto Sans KR',
          'sans-serif',
        ],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}

export default config
