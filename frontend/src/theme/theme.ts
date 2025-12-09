// theme.ts - Comprehensive theme configuration for Shamuga Billing

export const theme = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9f1239',
        900: '#831843',
      },
    },

    // Accent Colors
    accent: {
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      teal: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
      },
    },

    // Semantic Colors
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    // Neutral Colors
    neutral: {
      white: '#ffffff',
      black: '#000000',
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
    },
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(to right, #06b6d4, #2563eb)',
    primaryBr: 'linear-gradient(to bottom right, #06b6d4, #2563eb)',
    secondary: 'linear-gradient(to right, #a855f7, #ec4899)',
    background: 'linear-gradient(to bottom right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.85), rgba(131, 24, 67, 0.9))',
    accent: 'linear-gradient(to right, #22c55e, #14b8a6)',
    
    // Role-specific gradients
    admin: {
      base: 'linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
      hover: 'linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
    },
    operator1: {
      base: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
      hover: 'linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
    },
    operator2: {
      base: 'linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(20, 184, 166, 0.2))',
      hover: 'linear-gradient(to right, rgba(34, 197, 94, 0.3), rgba(20, 184, 166, 0.3))',
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Glow effects
    glow: {
      cyan: '0 0 20px rgba(6, 182, 212, 0.5)',
      blue: '0 0 20px rgba(37, 99, 235, 0.5)',
      purple: '0 0 20px rgba(168, 85, 247, 0.5)',
      pink: '0 0 20px rgba(236, 72, 153, 0.5)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Animations
  animations: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-20px)' },
      },
      fadeIn: {
        from: { opacity: '0', transform: 'translateY(-20px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      slideUp: {
        from: { opacity: '0', transform: 'translateY(30px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '25%': { transform: 'translateX(-10px)' },
        '75%': { transform: 'translateX(10px)' },
      },
      pulse: {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.5' },
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
      },
    },
  },

  // Effects
  effects: {
    backdrop: {
      blur: {
        sm: 'blur(4px)',
        base: 'blur(8px)',
        md: 'blur(12px)',
        lg: 'blur(16px)',
        xl: 'blur(24px)',
      },
    },
    opacity: {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      80: '0.8',
      90: '0.9',
      100: '1',
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index Scale
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ColorPalette = typeof theme.colors;
export type Gradient = typeof theme.gradients;

// Helper functions
export const getGradient = (type: keyof typeof theme.gradients) => theme.gradients[type];
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme.colors;
  for (const key of keys) {
    value = value?.[key];
  }
  return value;
};

// CSS Variables Generator (for use in global styles)
export const generateCSSVariables = () => {
  return `
    :root {
      /* Primary Colors */
      --color-cyan-400: ${theme.colors.primary.cyan[400]};
      --color-cyan-500: ${theme.colors.primary.cyan[500]};
      --color-blue-500: ${theme.colors.primary.blue[500]};
      --color-blue-600: ${theme.colors.primary.blue[600]};
      --color-indigo-900: ${theme.colors.primary.indigo[900]};
      --color-purple-500: ${theme.colors.primary.purple[500]};
      --color-purple-900: ${theme.colors.primary.purple[900]};
      --color-pink-500: ${theme.colors.primary.pink[500]};
      --color-pink-900: ${theme.colors.primary.pink[900]};
      
      /* Semantic Colors */
      --color-success: ${theme.colors.semantic.success};
      --color-warning: ${theme.colors.semantic.warning};
      --color-error: ${theme.colors.semantic.error};
      --color-info: ${theme.colors.semantic.info};
      
      /* Gradients */
      --gradient-primary: ${theme.gradients.primary};
      --gradient-background: ${theme.gradients.background};
      
      /* Shadows */
      --shadow-glow-cyan: ${theme.shadows.glow.cyan};
      
      /* Spacing */
      --spacing-4: ${theme.spacing[4]};
      --spacing-6: ${theme.spacing[6]};
      --spacing-8: ${theme.spacing[8]};
      
      /* Border Radius */
      --radius-xl: ${theme.borderRadius.xl};
      --radius-2xl: ${theme.borderRadius['2xl']};
      --radius-3xl: ${theme.borderRadius['3xl']};
      
      /* Animation Duration */
      --duration-base: ${theme.animations.duration.base};
    }
  `;
};

export default theme;
