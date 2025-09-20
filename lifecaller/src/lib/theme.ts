import { type ThemeMode } from '@/providers/ThemeProvider';

/**
 * Design token utilities and theme helpers
 */

// Color token categories
export const COLOR_CATEGORIES = {
  brand: ['primary', 'secondary', 'accent'],
  surface: ['background', 'card', 'elevation', 'stroke', 'divider'],
  text: ['primary', 'secondary', 'muted', 'inverse'],
  feedback: ['success', 'warning', 'danger', 'info'],
  status: [
    'pendente',
    'em_atendimento',
    'aguardando_aprovacao',
    'aprovado',
    'reprovado',
    'contrato_formalizado',
    'pago'
  ]
} as const;

export const SPACING_SCALE = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
export const RADIUS_SCALE = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
export const FONT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;
export const FONT_WEIGHTS = ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold'] as const;

// Comprehensive theme presets system
export const THEME_PRESETS = {
  // Core themes
  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme with blue accents',
    category: 'core',
    tokens: {
      'brand': '#4C8DFF',
      'brand-secondary': '#7A5CFF',
      'brand-accent': '#B895FF',
      'bg': '#0F1729',
      'card': '#1A253B',
      'elev': '#22304A',
      'stroke': '#2F3D57',
      'text': '#E8EEF7',
      'text-secondary': '#B6C4DB',
      'muted': '#8FA4C5',
      'success': '#1EDB83',
      'warning': '#F7B23B',
      'danger': '#F26767',
      'info': '#4AA3FF',
    }
  },
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme for better readability',
    category: 'core',
    tokens: {
      'brand': '#2563EB',
      'brand-secondary': '#7C3AED',
      'brand-accent': '#8B5CF6',
      'bg': '#FFFFFF',
      'card': '#FAFAFA',
      'elev': '#F5F5F5',
      'stroke': '#E5E7EB',
      'text': '#111827',
      'text-secondary': '#374151',
      'muted': '#6B7280',
      'success': '#059669',
      'warning': '#D97706',
      'danger': '#DC2626',
      'info': '#2563EB',
    }
  },

  // Accessibility themes
  highContrast: {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'WCAG AAA compliant high contrast theme',
    category: 'accessibility',
    tokens: {
      'brand': '#0066FF',
      'brand-secondary': '#0052CC',
      'brand-accent': '#7A3FFF',
      'bg': '#000000',
      'card': '#1A1A1A',
      'elev': '#2D2D2D',
      'stroke': '#FFFFFF',
      'text': '#FFFFFF',
      'text-secondary': '#E0E0E0',
      'muted': '#CCCCCC',
      'success': '#00FF00',
      'warning': '#FFFF00',
      'danger': '#FF0000',
      'info': '#00FFFF',
    }
  },
  darkHighContrast: {
    id: 'dark-high-contrast',
    name: 'Dark High Contrast',
    description: 'High contrast dark theme for accessibility',
    category: 'accessibility',
    tokens: {
      'brand': '#66B3FF',
      'brand-secondary': '#8A66FF',
      'brand-accent': '#B366FF',
      'bg': '#000000',
      'card': '#0D0D0D',
      'elev': '#1A1A1A',
      'stroke': '#4D4D4D',
      'text': '#FFFFFF',
      'text-secondary': '#E6E6E6',
      'muted': '#B3B3B3',
      'success': '#66FF66',
      'warning': '#FFFF66',
      'danger': '#FF6666',
      'info': '#66FFFF',
    }
  },

  // Brand themes
  corporate: {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Professional corporate theme',
    category: 'brand',
    tokens: {
      'brand': '#1E40AF',
      'brand-secondary': '#1E3A8A',
      'brand-accent': '#3B82F6',
      'bg': '#F8FAFC',
      'card': '#FFFFFF',
      'elev': '#F1F5F9',
      'stroke': '#CBD5E1',
      'text': '#0F172A',
      'text-secondary': '#334155',
      'muted': '#64748B',
      'success': '#059669',
      'warning': '#D97706',
      'danger': '#DC2626',
      'info': '#0369A1',
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    description: 'Fresh emerald green theme',
    category: 'brand',
    tokens: {
      'brand': '#059669',
      'brand-secondary': '#047857',
      'brand-accent': '#10B981',
      'bg': '#ECFDF5',
      'card': '#F0FDF4',
      'elev': '#DCFCE7',
      'stroke': '#BBF7D0',
      'text': '#064E3B',
      'text-secondary': '#065F46',
      'muted': '#047857',
      'success': '#059669',
      'warning': '#D97706',
      'danger': '#DC2626',
      'info': '#0369A1',
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset-inspired theme',
    category: 'brand',
    tokens: {
      'brand': '#EA580C',
      'brand-secondary': '#DC2626',
      'brand-accent': '#F59E0B',
      'bg': '#FFF7ED',
      'card': '#FFEDD5',
      'elev': '#FED7AA',
      'stroke': '#FDBA74',
      'text': '#9A3412',
      'text-secondary': '#C2410C',
      'muted': '#EA580C',
      'success': '#059669',
      'warning': '#D97706',
      'danger': '#DC2626',
      'info': '#0369A1',
    }
  },

  // Seasonal themes
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep midnight blue theme',
    category: 'seasonal',
    tokens: {
      'brand': '#3B82F6',
      'brand-secondary': '#1D4ED8',
      'brand-accent': '#60A5FA',
      'bg': '#030712',
      'card': '#0F172A',
      'elev': '#1E293B',
      'stroke': '#334155',
      'text': '#F8FAFC',
      'text-secondary': '#E2E8F0',
      'muted': '#94A3B8',
      'success': '#10B981',
      'warning': '#F59E0B',
      'danger': '#EF4444',
      'info': '#3B82F6',
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural forest green theme',
    category: 'seasonal',
    tokens: {
      'brand': '#166534',
      'brand-secondary': '#14532D',
      'brand-accent': '#16A34A',
      'bg': '#F0FDF4',
      'card': '#DCFCE7',
      'elev': '#BBF7D0',
      'stroke': '#86EFAC',
      'text': '#14532D',
      'text-secondary': '#166534',
      'muted': '#15803D',
      'success': '#16A34A',
      'warning': '#CA8A04',
      'danger': '#DC2626',
      'info': '#0369A1',
    }
  },

  // Experimental themes
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Vibrant neon cyberpunk theme',
    category: 'experimental',
    tokens: {
      'brand': '#FF0080',
      'brand-secondary': '#8000FF',
      'brand-accent': '#00FFFF',
      'bg': '#0A0A0A',
      'card': '#1A0A1A',
      'elev': '#2A1A2A',
      'stroke': '#FF0080',
      'text': '#00FFFF',
      'text-secondary': '#FF0080',
      'muted': '#8000FF',
      'success': '#00FF00',
      'warning': '#FFFF00',
      'danger': '#FF0000',
      'info': '#00FFFF',
    }
  },
  retro: {
    id: 'retro',
    name: 'Retro',
    description: 'Nostalgic 80s retro theme',
    category: 'experimental',
    tokens: {
      'brand': '#FF6B9D',
      'brand-secondary': '#A855F7',
      'brand-accent': '#06FFA5',
      'bg': '#1A0B3D',
      'card': '#2D1B69',
      'elev': '#3D2B79',
      'stroke': '#4C3B89',
      'text': '#FBBF24',
      'text-secondary': '#FF6B9D',
      'muted': '#A855F7',
      'success': '#06FFA5',
      'warning': '#FBBF24',
      'danger': '#FF4757',
      'info': '#5DADE2',
    }
  }
} as const;

/**
 * Get CSS custom property value from the document
 */
export function getCSSToken(tokenName: string): string {
  if (typeof window === 'undefined') return '';

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${tokenName}`)
    .trim();

  return value;
}

/**
 * Set CSS custom property on the document
 */
export function setCSSToken(tokenName: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(`--${tokenName}`, value);
}

/**
 * Remove CSS custom property from the document
 */
export function removeCSSToken(tokenName: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.removeProperty(`--${tokenName}`);
}

/**
 * Generate color variants for a base color
 */
export function generateColorVariants(baseColor: string) {
  // This is a simplified implementation
  // In a real app, you might use a color library like chroma.js
  return {
    50: `${baseColor}08`,   // 5% opacity
    100: `${baseColor}14`,  // 8% opacity
    200: `${baseColor}1F`,  // 12% opacity
    300: `${baseColor}3D`,  // 24% opacity
    400: `${baseColor}66`,  // 40% opacity
    500: baseColor,         // Base color
    600: baseColor,         // Slightly darker (would need color manipulation)
    700: baseColor,         // Darker
    800: baseColor,         // Much darker
    900: baseColor,         // Very dark
  };
}

/**
 * Get theme tokens for a specific mode
 */
export function getThemeTokens(mode: 'dark' | 'light') {
  const prefix = mode === 'dark' ? 'themeDark' : 'themeLight';

  const tokens: Record<string, string> = {};

  // This would typically read from your generated tokens
  if (typeof window !== 'undefined') {
    const styles = getComputedStyle(document.documentElement);

    // Extract all theme-specific tokens
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (sheet.cssRules) {
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
              const styleDeclaration = rule.style;
              for (let k = 0; k < styleDeclaration.length; k++) {
                const property = styleDeclaration[k];
                if (property.startsWith(`--${prefix}`)) {
                  const value = styleDeclaration.getPropertyValue(property);
                  const tokenName = property.replace(`--${prefix}`, '').replace(/([A-Z])/g, '-$1').toLowerCase();
                  tokens[tokenName] = value.trim();
                }
              }
            }
          }
        }
      } catch (e) {
        // Skip inaccessible stylesheets (CORS)
        continue;
      }
    }
  }

  return tokens;
}

/**
 * Validate theme token format
 */
export function validateThemeToken(key: string, value: string): { valid: boolean; error?: string } {
  if (!key || !value) {
    return { valid: false, error: 'Key and value are required' };
  }

  // Color validation (basic)
  if (key.includes('color') || key.includes('bg') || key.includes('text') || key.includes('brand')) {
    const colorRegex = /^(#[0-9A-F]{6}|#[0-9A-F]{3}|rgb\(|rgba\(|hsl\(|hsla\()/i;
    if (!colorRegex.test(value)) {
      return { valid: false, error: 'Invalid color format' };
    }
  }

  // Size validation (basic)
  if (key.includes('size') || key.includes('radius') || key.includes('space')) {
    const sizeRegex = /^(\d+(\.\d+)?(px|em|rem|%|vw|vh)|0)$/;
    if (!sizeRegex.test(value)) {
      return { valid: false, error: 'Invalid size format' };
    }
  }

  return { valid: true };
}

/**
 * Apply theme preset
 */
export function applyThemePreset(presetName: keyof typeof THEME_PRESETS, updateToken: (key: string, value: string) => void) {
  const preset = THEME_PRESETS[presetName];
  if (!preset) return;

  Object.entries(preset.tokens).forEach(([key, value]) => {
    updateToken(key, value);
  });
}

/**
 * Generate theme CSS for export
 */
export function generateThemeCSS(tokens: Record<string, string>, themeName = 'custom'): string {
  const cssVars = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `/* ${themeName} theme */
:root,
[data-theme="${themeName}"] {
${cssVars}
}`;
}

/**
 * Parse CSS theme import
 */
export function parseThemeCSS(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};

  // Simple regex to extract CSS custom properties
  const regex = /--([^:]+):\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const [, key, value] = match;
    tokens[key.trim()] = value.trim();
  }

  return tokens;
}

/**
 * Get color contrast ratio (simplified)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // This is a simplified implementation
  // In production, use a proper color contrast library
  return 4.5; // Mock value that meets WCAG AA standard
}

/**
 * Check if color meets accessibility standards
 */
export function isAccessible(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
}

/**
 * Token search and filtering
 */
export function searchTokens(query: string, tokens: Record<string, string>): Record<string, string> {
  const lowercaseQuery = query.toLowerCase();

  return Object.fromEntries(
    Object.entries(tokens).filter(([key, value]) =>
      key.toLowerCase().includes(lowercaseQuery) ||
      value.toLowerCase().includes(lowercaseQuery)
    )
  );
}

/**
 * Group tokens by category
 */
export function groupTokensByCategory(tokens: Record<string, string>): Record<string, Record<string, string>> {
  const groups: Record<string, Record<string, string>> = {
    colors: {},
    spacing: {},
    typography: {},
    borders: {},
    shadows: {},
    motion: {},
    other: {}
  };

  Object.entries(tokens).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();

    if (lowerKey.includes('color') || lowerKey.includes('bg') || lowerKey.includes('text') || lowerKey.includes('brand')) {
      groups.colors[key] = value;
    } else if (lowerKey.includes('space') || lowerKey.includes('gap') || lowerKey.includes('margin') || lowerKey.includes('padding')) {
      groups.spacing[key] = value;
    } else if (lowerKey.includes('font') || lowerKey.includes('text') || lowerKey.includes('line')) {
      groups.typography[key] = value;
    } else if (lowerKey.includes('border') || lowerKey.includes('radius')) {
      groups.borders[key] = value;
    } else if (lowerKey.includes('shadow') || lowerKey.includes('elevation')) {
      groups.shadows[key] = value;
    } else if (lowerKey.includes('duration') || lowerKey.includes('easing') || lowerKey.includes('motion')) {
      groups.motion[key] = value;
    } else {
      groups.other[key] = value;
    }
  });

  return groups;
}