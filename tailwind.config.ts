import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Medical trust colors - configurable per hospital via CSS variables
        primary: {
          DEFAULT: 'var(--color-primary, #0066CC)',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#0066CC', // Primary blue
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001429',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #00A859)',
          50: '#E6F7F0',
          100: '#CCEFE1',
          200: '#99DFC3',
          300: '#66CFA5',
          400: '#33BF87',
          500: '#00A859', // Medical green
          600: '#008647',
          700: '#006535',
          800: '#004323',
          900: '#002212',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #FF6B35)',
          50: '#FFE9E3',
          100: '#FFD4C7',
          200: '#FFA98F',
          300: '#FF7E57',
          400: '#FF6B35', // Accent orange
          500: '#FF5315',
          600: '#CC4311',
          700: '#99320D',
          800: '#662109',
          900: '#331105',
        },
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
          950: '#030712',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',  // 352px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'carousel-slide': 'carouselSlide 5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        carouselSlide: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-100%)' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'header': '0 2px 4px rgba(0, 0, 0, 0.08)',
      },
      minHeight: {
        'hero': 'calc(100vh - 80px)', // Account for header height
      },
      maxHeight: {
        'hero': '800px', // Max 2 viewport heights as per spec
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
