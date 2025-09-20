import React, { useState } from 'react';
import { Accessibility, Building2, ChevronDown, FlaskRound, Leaf, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { useTheme } from '@/providers/ThemeProvider';
import { THEME_PRESETS, setCSSToken } from '@/lib/theme';
import { cn } from '@/lib/cn';

type ThemeCategory = 'core' | 'accessibility' | 'brand' | 'seasonal' | 'experimental';

const categoryIcons: Record<ThemeCategory, LucideIcon> = {
  core: Palette,
  accessibility: Accessibility,
  brand: Building2,
  seasonal: Leaf,
  experimental: FlaskRound,
};

const categoryDescriptions: Record<ThemeCategory, string> = {
  core: 'Essential light and dark themes',
  accessibility: 'High contrast themes for better accessibility',
  brand: 'Professional and corporate themes',
  seasonal: 'Nature-inspired seasonal themes',
  experimental: 'Creative and experimental themes',
};

interface ThemePreviewProps {
  presetKey: string;
  preset: typeof THEME_PRESETS[keyof typeof THEME_PRESETS];
  isActive?: boolean;
  onApply: (presetKey: string) => void;
}

function ThemePreview({ presetKey, preset, isActive, onApply }: ThemePreviewProps) {
  const colors = [
    preset.tokens.brand,
    preset.tokens.bg,
    preset.tokens.card,
    preset.tokens.text,
  ];

  return (
    <Card
      variant={isActive ? "elevated" : "default"}
      className={cn(
        "cursor-pointer transition-all hover:scale-105",
        isActive && "ring-2 ring-brand"
      )}
      onClick={() => onApply(presetKey)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{preset.name}</CardTitle>
          {isActive && (
            <div className="h-2 w-2 rounded-full bg-brand" aria-label="Active theme" />
          )}
        </div>
        <CardDescription className="text-xs">{preset.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-1 mb-3">
          {colors.map((color, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border border-surface-stroke flex-shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          ))}
        </div>
        <Button
          size="sm"
          variant={isActive ? "secondary" : "ghost"}
          className="w-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onApply(presetKey);
          }}
        >
          {isActive ? 'Active' : 'Apply'}
        </Button>
      </CardContent>
    </Card>
  );
}

interface ThemeCategoryProps {
  category: ThemeCategory;
  presets: Record<string, typeof THEME_PRESETS[keyof typeof THEME_PRESETS]>;
  activeTheme?: string;
  onApply: (presetKey: string) => void;
}

function ThemeCategory({ category, presets, activeTheme, onApply }: ThemeCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(category === 'core');
  const CategoryIcon = categoryIcons[category];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-3 rounded-lg bg-surface-card hover:bg-surface-elevation transition-colors"
      >
        <div className="flex items-center gap-3">
          <CategoryIcon className="h-5 w-5" aria-hidden="true" />
          <div className="text-left">
            <h3 className="font-medium capitalize">{category}</h3>
            <p className="text-sm text-text-secondary">{categoryDescriptions[category]}</p>
          </div>
        </div>
        <div className={cn(
          "transition-transform",
          isExpanded ? "rotate-180" : "rotate-0"
        )}>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-6">
          {Object.entries(presets).map(([key, preset]) => (
            <ThemePreview
              key={key}
              presetKey={key}
              preset={preset}
              isActive={activeTheme === key}
              onApply={onApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThemePresets() {
  const theme = useTheme();
  const [activePreset, setActivePreset] = useState<string>('dark');

  const handleApplyPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey as keyof typeof THEME_PRESETS];
    if (!preset) return;

    // Apply all tokens from the preset
    Object.entries(preset.tokens).forEach(([tokenName, value]) => {
      theme.updateCustomToken(tokenName, value);
      setCSSToken(tokenName, value);
    });

    setActivePreset(presetKey);
  };

  // Group presets by category
  const presetsByCategory = Object.entries(THEME_PRESETS).reduce((acc, [key, preset]) => {
    const category = preset.category as ThemeCategory;
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][key] = preset;
    return acc;
  }, {} as Record<ThemeCategory, Record<string, typeof THEME_PRESETS[keyof typeof THEME_PRESETS]>>);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="heading-2">Theme Presets</h2>
        <p className="body-text text-text-secondary">
          Choose from our curated collection of themes or use them as starting points for your custom designs.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={theme.resetCustomTokens}
        >
          Reset to Default
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const themeData = theme.exportTheme();
            const blob = new Blob([themeData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `theme-${activePreset}-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Current Theme
        </Button>
      </div>

      <div className="space-y-6">
        {(Object.keys(presetsByCategory) as ThemeCategory[]).map((category) => (
          <ThemeCategory
            key={category}
            category={category}
            presets={presetsByCategory[category]}
            activeTheme={activePreset}
            onApply={handleApplyPreset}
          />
        ))}
      </div>

      <Card variant="flat" className="mt-8">
        <CardHeader>
          <CardTitle>Custom Theme Tips</CardTitle>
          <CardDescription>
            Make your theme unique with these suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-brand">•</span>
              <div>
                <strong>Start with a preset:</strong> Choose a theme close to your vision and customize from there
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-brand">•</span>
              <div>
                <strong>Test accessibility:</strong> Ensure your color choices meet WCAG contrast guidelines
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-brand">•</span>
              <div>
                <strong>Export and share:</strong> Save your custom themes and share them with your team
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-brand">•</span>
              <div>
                <strong>Consider context:</strong> Different themes work better for different use cases
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemePresets;
