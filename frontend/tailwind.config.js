/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#08090a',
          1: '#0f1011',
          2: '#191a1b',
          3: '#28282c',
        },
        brand: {
          DEFAULT: '#5e6ad2',
          light: '#7170ff',
          lighter: '#828fff',
        },
        text: {
          primary: '#f7f8f8',
          secondary: '#d0d6e0',
          tertiary: '#8a8f98',
          quaternary: '#62666d',
        },
        border: {
          subtle: 'rgba(255,255,255,0.05)',
          standard: 'rgba(255,255,255,0.08)',
          strong: 'rgba(255,255,255,0.12)',
        },
        status: {
          ok: '#27a644',
          warn: '#f59e0b',
          error: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        display: ['2rem', { lineHeight: '1.13', letterSpacing: '-0.704px', fontWeight: '510' }],
        heading: ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.288px', fontWeight: '400' }],
        subheading: ['1.25rem', { lineHeight: '1.33', letterSpacing: '-0.24px', fontWeight: '590' }],
      },
      boxShadow: {
        surface: 'rgba(0,0,0,0.2) 0px 0px 0px 1px',
        elevated: 'rgba(0,0,0,0.4) 0px 2px 4px',
        dialog: 'rgba(0,0,0,0) 0px 8px 2px, rgba(0,0,0,0.01) 0px 5px 2px, rgba(0,0,0,0.04) 0px 3px 2px, rgba(0,0,0,0.07) 0px 1px 1px, rgba(0,0,0,0.08) 0px 0px 1px',
        focus: 'rgba(94,106,210,0.3) 0px 0px 0px 2px',
      },
    },
  },
  plugins: [],
};
