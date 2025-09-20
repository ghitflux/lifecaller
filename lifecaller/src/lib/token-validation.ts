/**
 * Design Token Validation and Testing Utilities
 *
 * This module provides comprehensive validation, testing, and quality assurance
 * tools for design tokens to ensure consistency and accessibility.
 */

// Token validation rules and types
export interface TokenValidationRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate: (tokenName: string, value: string, allTokens: Record<string, string>) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  suggestion?: string;
}

export interface TokenValidationReport {
  tokenName: string;
  value: string;
  results: Array<{
    rule: string;
    severity: 'error' | 'warning' | 'info';
    valid: boolean;
    message?: string;
    suggestion?: string;
  }>;
  overallValid: boolean;
}

// Color utilities for validation
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Validation rules
export const TOKEN_VALIDATION_RULES: TokenValidationRule[] = [
  // Color format validation
  {
    name: 'color-format',
    description: 'Color tokens must use valid hex, rgb, or hsl format',
    severity: 'error',
    validate: (tokenName: string, value: string) => {
      if (!tokenName.includes('color') && !tokenName.includes('bg') && !tokenName.includes('text') && !tokenName.includes('brand') && !tokenName.includes('stroke')) {
        return { valid: true };
      }

      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
      const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
      const hslRegex = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
      const hslaRegex = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/;

      const isValid = hexRegex.test(value) || rgbRegex.test(value) || rgbaRegex.test(value) ||
                     hslRegex.test(value) || hslaRegex.test(value);

      return {
        valid: isValid,
        message: isValid ? undefined : `Invalid color format: ${value}`,
        suggestion: 'Use hex (#FF0000), rgb(255, 0, 0), or hsl(0, 100%, 50%) format'
      };
    }
  },

  // Size/spacing validation
  {
    name: 'size-format',
    description: 'Size tokens must use valid CSS units',
    severity: 'error',
    validate: (tokenName: string, value: string) => {
      if (!tokenName.includes('size') && !tokenName.includes('space') && !tokenName.includes('radius') && !tokenName.includes('width') && !tokenName.includes('height')) {
        return { valid: true };
      }

      const sizeRegex = /^(\d+(\.\d+)?(px|em|rem|%|vw|vh|vmin|vmax)|0)$/;
      const isValid = sizeRegex.test(value);

      return {
        valid: isValid,
        message: isValid ? undefined : `Invalid size format: ${value}`,
        suggestion: 'Use CSS units like px, em, rem, % (e.g., 16px, 1rem, 100%)'
      };
    }
  },

  // Contrast validation for text colors
  {
    name: 'text-contrast',
    description: 'Text colors must meet WCAG AA contrast requirements',
    severity: 'warning',
    validate: (tokenName: string, value: string, allTokens: Record<string, string>) => {
      if (!tokenName.includes('text') || tokenName.includes('text-inverse')) {
        return { valid: true };
      }

      const backgroundColors = [
        allTokens['bg'],
        allTokens['card'],
        allTokens['elev']
      ].filter(Boolean);

      for (const bgColor of backgroundColors) {
        const contrast = getContrastRatio(value, bgColor);
        if (contrast < 4.5) {
          return {
            valid: false,
            message: `Low contrast ratio (${contrast.toFixed(2)}) with background ${bgColor}`,
            suggestion: 'Ensure contrast ratio is at least 4.5:1 for WCAG AA compliance'
          };
        }
      }

      return { valid: true };
    }
  },

  // Color consistency validation
  {
    name: 'color-consistency',
    description: 'Related colors should have consistent hue relationships',
    severity: 'info',
    validate: (tokenName: string, value: string, allTokens: Record<string, string>) => {
      if (!tokenName.includes('brand')) {
        return { valid: true };
      }

      // Check if primary and secondary brand colors are harmonious
      if (tokenName === 'brand' && allTokens['brand-secondary']) {
        // This is a simplified check - in practice, you might want more sophisticated color harmony detection
        return {
          valid: true,
          message: 'Consider using color harmony tools to ensure brand colors work well together',
          suggestion: 'Use analogous, complementary, or triadic color schemes for better harmony'
        };
      }

      return { valid: true };
    }
  },

  // Spacing scale validation
  {
    name: 'spacing-scale',
    description: 'Spacing tokens should follow a consistent scale',
    severity: 'info',
    validate: (tokenName: string, value: string, allTokens: Record<string, string>) => {
      if (!tokenName.includes('space')) {
        return { valid: true };
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return { valid: true };
      }

      // Check if spacing follows a reasonable scale (powers of 2, fibonacci, etc.)
      const commonSpacingValues = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
      const isOnScale = commonSpacingValues.some(scale => Math.abs(numericValue - scale) < 2);

      return {
        valid: isOnScale,
        message: isOnScale ? undefined : `Spacing value ${numericValue} doesn't follow common scale`,
        suggestion: 'Consider using values from a consistent spacing scale (4, 8, 12, 16, 24, 32, 48px)'
      };
    }
  },

  // Typography scale validation
  {
    name: 'typography-scale',
    description: 'Font sizes should follow a typographic scale',
    severity: 'info',
    validate: (tokenName: string, value: string) => {
      if (!tokenName.includes('font-size')) {
        return { valid: true };
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return { valid: true };
      }

      // Common typographic scale (Major Third: 1.25)
      const baseSize = 16;
      const ratio = 1.25;
      const scaleValues = Array.from({ length: 10 }, (_, i) =>
        Math.round(baseSize * Math.pow(ratio, i - 4))
      );

      const isOnScale = scaleValues.some(scale => Math.abs(numericValue - scale) < 2);

      return {
        valid: isOnScale,
        message: isOnScale ? undefined : `Font size ${numericValue} doesn't follow typographic scale`,
        suggestion: 'Consider using values from a consistent typographic scale (major third: 1.25 ratio)'
      };
    }
  },

  // Motion duration validation
  {
    name: 'motion-duration',
    description: 'Animation durations should be within reasonable ranges',
    severity: 'warning',
    validate: (tokenName: string, value: string) => {
      if (!tokenName.includes('duration') && !tokenName.includes('motion')) {
        return { valid: true };
      }

      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return { valid: true };
      }

      // Convert to milliseconds for consistent checking
      const msValue = value.includes('s') && !value.includes('ms') ? numericValue * 1000 : numericValue;

      const isReasonable = msValue >= 50 && msValue <= 1000;

      return {
        valid: isReasonable,
        message: isReasonable ? undefined : `Animation duration ${msValue}ms is outside recommended range`,
        suggestion: 'Use durations between 50ms-1000ms for good user experience'
      };
    }
  }
];

// Validation functions
export function validateToken(
  tokenName: string,
  value: string,
  allTokens: Record<string, string> = {},
  rules: TokenValidationRule[] = TOKEN_VALIDATION_RULES
): TokenValidationReport {
  const results = rules.map(rule => {
    const result = rule.validate(tokenName, value, allTokens);
    return {
      rule: rule.name,
      severity: rule.severity,
      ...result
    };
  });

  const hasErrors = results.some(r => !r.valid && r.severity === 'error');

  return {
    tokenName,
    value,
    results,
    overallValid: !hasErrors
  };
}

export function validateTokenSet(
  tokens: Record<string, string>,
  rules: TokenValidationRule[] = TOKEN_VALIDATION_RULES
): TokenValidationReport[] {
  return Object.entries(tokens).map(([name, value]) =>
    validateToken(name, value, tokens, rules)
  );
}

// Accessibility testing
export interface AccessibilityReport {
  score: number; // 0-100
  issues: Array<{
    type: 'contrast' | 'color-blindness' | 'motion';
    severity: 'error' | 'warning';
    message: string;
    tokens: string[];
  }>;
  recommendations: string[];
}

export function generateAccessibilityReport(tokens: Record<string, string>): AccessibilityReport {
  const issues: AccessibilityReport['issues'] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Test contrast ratios
  const textColors = Object.entries(tokens).filter(([name]) => name.includes('text'));
  const backgroundColors = Object.entries(tokens).filter(([name]) =>
    name.includes('bg') || name.includes('card')
  );

  for (const [textName, textColor] of textColors) {
    for (const [bgName, bgColor] of backgroundColors) {
      const contrast = getContrastRatio(textColor, bgColor);

      if (contrast < 4.5) {
        issues.push({
          type: 'contrast',
          severity: contrast < 3 ? 'error' : 'warning',
          message: `Low contrast between ${textName} and ${bgName} (${contrast.toFixed(2)}:1)`,
          tokens: [textName, bgName]
        });
        score -= contrast < 3 ? 20 : 10;
      }
    }
  }

  // Test for motion preferences
  const motionTokens = Object.entries(tokens).filter(([name]) => name.includes('duration'));
  for (const [name, value] of motionTokens) {
    const duration = parseFloat(value);
    if (duration > 500) {
      recommendations.push(`Consider providing reduced motion alternatives for ${name}`);
    }
  }

  // Add general recommendations
  if (issues.length === 0) {
    recommendations.push('Great! Your theme meets basic accessibility standards.');
  } else {
    recommendations.push('Consider using tools like WebAIM Contrast Checker for detailed analysis');
    recommendations.push('Test your theme with screen readers and keyboard navigation');
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

// Theme quality assessment
export interface ThemeQualityReport {
  overall: number; // 0-100
  categories: {
    consistency: number;
    accessibility: number;
    usability: number;
    aesthetics: number;
  };
  suggestions: string[];
}

export function assessThemeQuality(tokens: Record<string, string>): ThemeQualityReport {
  const validationResults = validateTokenSet(tokens);
  const accessibilityReport = generateAccessibilityReport(tokens);

  // Calculate consistency score
  const consistencyErrors = validationResults.filter(r =>
    !r.overallValid && r.results.some(res => res.severity === 'error')
  ).length;
  const consistency = Math.max(0, 100 - (consistencyErrors * 10));

  // Use accessibility score
  const accessibility = accessibilityReport.score;

  // Calculate usability score based on warnings
  const usabilityWarnings = validationResults.filter(r =>
    r.results.some(res => !res.valid && res.severity === 'warning')
  ).length;
  const usability = Math.max(0, 100 - (usabilityWarnings * 5));

  // Calculate aesthetics score based on info suggestions
  const aestheticSuggestions = validationResults.filter(r =>
    r.results.some(res => !res.valid && res.severity === 'info')
  ).length;
  const aesthetics = Math.max(0, 100 - (aestheticSuggestions * 3));

  const overall = Math.round((consistency + accessibility + usability + aesthetics) / 4);

  const suggestions: string[] = [
    ...accessibilityReport.recommendations,
    ...(consistency < 80 ? ['Fix validation errors to improve consistency'] : []),
    ...(usability < 80 ? ['Address usability warnings for better user experience'] : []),
    ...(aesthetics < 90 ? ['Consider aesthetic improvements for visual harmony'] : [])
  ];

  return {
    overall,
    categories: {
      consistency,
      accessibility,
      usability,
      aesthetics
    },
    suggestions
  };
}

// Test utilities for development
export function runTokenTests(tokens: Record<string, string>): {
  validation: TokenValidationReport[];
  accessibility: AccessibilityReport;
  quality: ThemeQualityReport;
} {
  return {
    validation: validateTokenSet(tokens),
    accessibility: generateAccessibilityReport(tokens),
    quality: assessThemeQuality(tokens)
  };
}

// Export for use in tests
export const TokenValidation = {
  validateToken,
  validateTokenSet,
  generateAccessibilityReport,
  assessThemeQuality,
  runTokenTests,
  TOKEN_VALIDATION_RULES,
  getContrastRatio,
  getLuminance
};