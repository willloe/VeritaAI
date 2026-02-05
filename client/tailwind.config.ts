import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          board: 'var(--surface-board)',
          overlay: 'var(--surface-overlay)',
          'overlay-hovered': 'var(--surface-overlay-hovered)',
          raised: 'var(--surface-raised)',
          'raised-hovered': 'var(--surface-raised-hovered)',
          sunken: 'var(--surface-sunken)',
          input: 'var(--surface-input)',
        },
        text: {
          DEFAULT: 'var(--text-default)',
          subtle: 'var(--text-subtle)',
          subtlest: 'var(--text-subtlest)',
          inverse: 'var(--text-inverse)',
          link: 'var(--text-link)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
        },
        accent: {
          blue: 'var(--accent-blue)',
          'blue-subtle': 'var(--accent-blue-subtle)',
          green: 'var(--accent-green)',
          'green-subtle': 'var(--accent-green-subtle)',
          red: 'var(--accent-red)',
          'red-subtle': 'var(--accent-red-subtle)',
          purple: 'var(--accent-purple)',
          'purple-subtle': 'var(--accent-purple-subtle)',
          orange: 'var(--accent-orange)',
          'orange-subtle': 'var(--accent-orange-subtle)',
          yellow: 'var(--accent-yellow)',
          'yellow-subtle': 'var(--accent-yellow-subtle)',
        },
        backdrop: 'var(--backdrop)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        list: 'var(--radius-list)',
        button: 'var(--radius-button)',
        modal: 'var(--radius-modal)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-dragging': 'var(--shadow-card-dragging)',
        list: 'var(--shadow-list)',
        overlay: 'var(--shadow-overlay)',
        modal: 'var(--shadow-modal)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Noto Sans',
          'Ubuntu',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      fontSize: {
        'card-title': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'list-title': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'modal-title': ['20px', { lineHeight: '24px', fontWeight: '600' }],
        badge: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'menu-item': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'menu-heading': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        button: ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },
      spacing: {
        'list-gap': 'var(--spacing-list-gap)',
        'card-gap': 'var(--spacing-card-gap)',
        'card-px': 'var(--spacing-card-px)',
        'card-py': 'var(--spacing-card-py)',
        'list-px': 'var(--spacing-list-px)',
        'list-py': 'var(--spacing-list-py)',
      },
    },
  },
  plugins: [],
};

export default config;
