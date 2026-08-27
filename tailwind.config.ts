import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        surface: '#F3F5F7',
        surface2: '#E8EBEE',
        tint: '#EEF4FD',
        ink: '#191F28',
        charcoal: '#4E5968',
        warmgray: '#646D7B',
        line: '#E5E8EB',
        accent: '#1B64DA',
        accenthover: '#1957C2',
        accentlit: '#3182F6',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Apple SD Gothic Neo',
          'Noto Sans JP',
          'Noto Sans KR',
          'sans-serif',
        ],
        // Legacy alias — the serif face is gone; anything still tagged
        // font-serif renders in the sans stack.
        serif: [
          'var(--font-sans)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Hiragino Kaku Gothic ProN',
          'Apple SD Gothic Neo',
          'Noto Sans JP',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.23, 1, 0.32, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(25,31,40,0.03), 0 8px 24px -8px rgba(25,31,40,0.08)',
        lift: '0 2px 4px rgba(25,31,40,0.04), 0 24px 48px -12px rgba(25,31,40,0.16)',
        island: '0 1px 1px rgba(25,31,40,0.03), 0 12px 32px -8px rgba(25,31,40,0.12)',
        blue: '0 16px 40px -12px rgba(27,100,218,0.45)',
      },
    },
  },
  plugins: [],
}

export default config
