// tailwind.config.js
// FeatureTrack Design System
// Philosophy: White canvas, hairline dividers, no nested cards, flat rows.
// Colors: Neutral black/white only — no colored accents.
// Inspired by AppTheme design rules (see app_theme.dart).

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ── COLORS ──────────────────────────────────────────────────────────
      // Rule: 80% neutral. Black/white canvas only.
      // Status colors kept minimal — dots only, no pill backgrounds.
      colors: {
        // Canvas & surfaces (Rule 1 — white canvas)
        canvas:   '#FFFFFF',
        surface:  '#F8F9FA',   // backgroundLight — scaffold background

        // Text scale
        ink: {
          DEFAULT: '#0F172A', // textDark — primary text
          muted:   '#6C757D', // textMuted — secondary, labels, placeholders
          faint:   '#94A3B8', // very muted — timestamps, hints
        },

        // Borders & dividers (Rule 2 — hairlines only)
        hairline: '#EEEEEE',  // canonical divider — 0.5px
        border:   '#E0E0E0',  // slightly stronger — input borders, cards

        // Neutrals — interactive controls only (Rule 3)
        neutral: {
          50:  '#F8F9FA',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },

        // Status — DOTS ONLY, never pill backgrounds (Rule 5)
        // Use these as dot colors: w-1.5 h-1.5 rounded-full bg-status-open
        status: {
          open:        '#3B82F6', // blue dot
          'in-progress': '#8B5CF6', // violet dot
          completed:   '#22C55E', // green dot
        },

        // Priority dots — same rule, dots only
        priority: {
          high:   '#EF4444', // red dot
          medium: '#F59E0B', // amber dot
          low:    '#22C55E', // green dot
        },

        // Danger (delete confirmations, error states)
        danger: {
          DEFAULT: '#EF4444',
          bg:      '#FFF5F5',
          border:  '#FECACA',
        },
      },

      // ── TYPOGRAPHY ──────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],  // headers, page titles
        mono:  ['JetBrains Mono', 'monospace'],         // data, dates
      },

      fontSize: {
        // Label scale (Rule 18 equivalent — uppercase section labels)
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        'xs':  ['11px', { lineHeight: '16px', letterSpacing: '0.05em' }],
        'sm':  ['12px', { lineHeight: '18px' }],
        'base':['14px', { lineHeight: '22px' }],
        'md':  ['15px', { lineHeight: '24px' }],
        'lg':  ['16px', { lineHeight: '26px' }],
        'xl':  ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '30px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['28px', { lineHeight: '36px' }],
        '5xl': ['32px', { lineHeight: '40px' }],
      },

      // ── SPACING ─────────────────────────────────────────────────────────
      // Rule 15: generous spacing between sections (gap-10), within (gap-6)
      spacing: {
        '4.5': '18px',
        '13':  '52px',  // icon indent for indented dividers (Rule 2)
        '15':  '60px',
        '18':  '72px',
        '22':  '88px',
      },

      // ── BORDER RADIUS ───────────────────────────────────────────────────
      borderRadius: {
        'sm':  '6px',
        DEFAULT: '8px',
        'md':  '10px',
        'lg':  '12px',
        'xl':  '14px',
        '2xl': '16px',
        '3xl': '20px',
      },

      // ── SHADOWS ─────────────────────────────────────────────────────────
      // Keep shadows subtle — canvas philosophy means surfaces don't float
      boxShadow: {
        'xs':   '0 1px 3px rgba(0,0,0,0.06)',
        'sm':   '0 2px 8px rgba(0,0,0,0.07)',
        DEFAULT:'0 4px 16px rgba(0,0,0,0.08)',
        'md':   '0 8px 24px rgba(0,0,0,0.09)',
        'lg':   '0 16px 40px rgba(0,0,0,0.10)',
        'modal':'0 24px 64px rgba(0,0,0,0.14)',
        'none': 'none',
      },

      // ── ANIMATION ───────────────────────────────────────────────────────
      // Rule 11 / Rule 22: purposeful, not decorative
      transitionDuration: {
        'fast':   '120ms',  // kHoverFade
        DEFAULT:  '180ms',  // kPaneTransition
        'normal': '200ms',  // state changes
        'slide':  '220ms',  // kDetailSlideIn
        'slow':   '280ms',  // staggered list items
      },
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // FAB entrance
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':   'fadeIn 150ms ease both',
        'slide-up':  'slideUp 200ms ease both',
        'slide-down':'slideDown 180ms ease both',
        'scale-in':  'scaleIn 180ms ease both',
      },

      // ── BREAKPOINTS (Rule 21) ───────────────────────────────────────────
      screens: {
        'sm':  '600px',   // kCompactBreak
        'md':  '720px',   // kMediumBreak — desktop sidebar appears
        'lg':  '1024px',  // kDesktopBreak — full 3-zone layout
        'xl':  '1280px',  // kWideBreak — content capped at maxWidth
      },

      // ── MAX WIDTHS ──────────────────────────────────────────────────────
      maxWidth: {
        'content': '820px',   // kMainContentMaxWidth
        'form':    '520px',   // form fields on desktop (Rule 15)
        'modal':   '560px',   // command palette / modals (Rule 20)
        'sidebar': '260px',   // kSidebarWidth
        'detail':  '340px',   // kDetailPaneWidth
      },
    },
  },
  plugins: [],
};
