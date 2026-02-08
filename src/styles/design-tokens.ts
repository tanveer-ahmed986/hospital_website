/**
 * Design Tokens for Hospital Website
 *
 * Centralized design system values for colors, spacing, typography, and animations.
 * These tokens are configured per hospital via YAML config files.
 */

// ============================================================================
// Colors (Medical/Healthcare Theme)
// ============================================================================

export const colors = {
  // Primary colors (loaded from hospital config)
  primary: {
    50: '#E6F2FF',
    100: '#CCE5FF',
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#0066CC', // Primary
    600: '#0052A3',
    700: '#003D7A',
    800: '#002952',
    900: '#001429',
  },
  secondary: {
    50: '#E6F7F0',
    100: '#CCEFE0',
    200: '#99DFC2',
    300: '#66CFA3',
    400: '#33BF85',
    500: '#00A859', // Secondary (medical green)
    600: '#008647',
    700: '#006535',
    800: '#004324',
    900: '#002212',
  },
  accent: {
    50: '#FFF0EB',
    100: '#FFE1D6',
    200: '#FFC3AD',
    300: '#FFA585',
    400: '#FF875C',
    500: '#FF6B35', // Accent
    600: '#CC552A',
    700: '#99401F',
    800: '#662A15',
    900: '#33150A',
  },

  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  success: {
    light: '#10B981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  warning: {
    light: '#F59E0B',
    DEFAULT: '#D97706',
    dark: '#B45309',
  },
  error: {
    light: '#EF4444',
    DEFAULT: '#DC2626',
    dark: '#B91C1C',
  },
  info: {
    light: '#3B82F6',
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
  },
};

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  fontFamily: {
    heading: 'var(--font-heading, Montserrat, sans-serif)',
    body: 'var(--font-body, "Open Sans", sans-serif)',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
};

// ============================================================================
// Spacing (8px base unit)
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
};

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// ============================================================================
// Shadows
// ============================================================================

export const boxShadow = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

// ============================================================================
// Transitions & Animations
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
};

// ============================================================================
// Breakpoints (Mobile-First)
// ============================================================================

export const breakpoints = {
  xs: '320px', // Mobile small
  sm: '640px', // Mobile large
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Desktop large
  '2xl': '1536px', // Desktop extra large
};

// ============================================================================
// Z-Index Scale
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};
