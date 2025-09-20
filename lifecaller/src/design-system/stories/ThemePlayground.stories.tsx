import React, { useEffect, useState, useMemo, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { StatusBadge } from "../components/StatusBadge";
import { Heading } from "../components/Heading";
import { NoteInput } from "../components/NoteInput";
import { QueueCard } from "../components/QueueCard";
import { AttendantCard } from "../components/AttendantCard";
import { CallControls, type CallAction } from "../components/CallControls";
import { ThemeProvider, useTheme, ThemeSwitcher } from "@/providers/ThemeProvider";
import { THEME_PRESETS, setCSSToken, getCSSToken, validateThemeToken, groupTokensByCategory } from "@/lib/theme";

const STATUS_VARIANTS = [
  "pendente",
  "em_atendimento",
  "aguardando_aprovacao",
  "aprovado",
  "reprovado",
  "contrato_formalizado",
  "pago",
] as const;

const ALL_ACTIONS = [
  "atender",
  "aguardar",
  "retomar",
  "transferir",
  "mutar",
  "finalizar",
] as const satisfies ReadonlyArray<CallAction>;

// Token categories for organization
const TOKEN_CATEGORIES = {
  brand: ['brand', 'brand-secondary', 'brand-accent'],
  surface: ['bg', 'card', 'elev', 'stroke', 'divider'],
  text: ['text', 'text-secondary', 'muted', 'text-inverse'],
  feedback: ['success', 'warning', 'danger', 'info'],
  spacing: ['space-xs', 'space-sm', 'space-md', 'space-lg', 'space-xl'],
  radius: ['radius-sm', 'radius-md', 'radius-lg', 'radius-xl', 'radius-2xl'],
  typography: ['font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl'],
} as const;

interface TokenEditorProps {
  category: string;
  tokens: string[];
  onTokenChange: (tokenName: string, value: string) => void;
}

function TokenEditor({ category, tokens, onTokenChange }: TokenEditorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-secondary capitalize">{category}</h3>
      <div className="space-y-2">
        {tokens.map((tokenName) => {
          const currentValue = getCSSToken(tokenName);
          const isColor = category === 'brand' || category === 'surface' || category === 'text' || category === 'feedback';
          const isSize = category === 'spacing' || category === 'radius' || category === 'typography';

          return (
            <div key={tokenName} className="flex items-center gap-2">
              <label className="text-xs text-muted min-w-0 flex-1 truncate">
                {tokenName}
              </label>
              {isColor ? (
                <input
                  type="color"
                  value={currentValue.startsWith('#') ? currentValue : '#000000'}
                  onChange={(e) => onTokenChange(tokenName, e.target.value)}
                  className="w-8 h-8 rounded border border-stroke"
                />
              ) : isSize ? (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => onTokenChange(tokenName, e.target.value)}
                  className="w-20 px-2 py-1 text-xs rounded border border-stroke bg-card"
                  placeholder="8px"
                />
              ) : (
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) => onTokenChange(tokenName, e.target.value)}
                  className="w-32 px-2 py-1 text-xs rounded border border-stroke bg-card"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThemePresetSelector({ onPresetApply }: { onPresetApply: (presetName: keyof typeof THEME_PRESETS) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-secondary">Theme Presets</h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(THEME_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onPresetApply(key as keyof typeof THEME_PRESETS)}
            className="text-left p-3 rounded-lg border border-stroke hover:bg-card transition-colors"
          >
            <div className="font-medium text-sm">{preset.name}</div>
            <div className="text-xs text-muted">{preset.description}</div>
            <div className="flex gap-1 mt-2">
              {Object.values(preset.tokens).slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-stroke"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComponentPreview() {
  return (
    <div className="space-y-6">
      {/* Status Badges */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Status Badges</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_VARIANTS.map((variant) => (
            <StatusBadge key={variant} variant={variant} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      {/* Queue Card */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Queue Card</h3>
        <QueueCard
          title="Maria Silva Santos"
          subtitle="CPF: 123.456.789-01 • Matrícula: 12345"
          phone="(11) 99999-9999"
          status="aguardando_aprovacao"
          notes="Cliente aguardando confirmação do supervisor."
          actions={[
            { label: "Detalhes", onClick: () => {} },
            { label: "Encaminhar", onClick: () => {} },
          ]}
        />
      </div>

      {/* Attendant Card */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Attendant Card</h3>
        <AttendantCard
          name="Marina Paiva"
          role="Atendente — Pós-Sim"
          status="em_atendimento"
          since="09:12"
          queue="Pós-Sim"
        />
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Typography</h3>
        <div className="space-y-2">
          <Heading level="h1">Heading 1</Heading>
          <Heading level="h2">Heading 2</Heading>
          <Heading level="h3">Heading 3</Heading>
          <p className="body-text">Body text with proper line height and spacing for readability.</p>
          <p className="caption-text">Caption text for smaller labels and metadata.</p>
        </div>
      </div>

      {/* Note Input */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-secondary">Note Input</h3>
        <NoteInput
          placeholder="Registrar nova tratativa..."
          onSubmit={(value) => console.log("nota", value)}
        />
      </div>
    </div>
  );
}

function ThemePlaygroundContent() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("brand");

  const handleTokenChange = useCallback((tokenName: string, value: string) => {
    const validation = validateThemeToken(tokenName, value);
    if (validation.valid) {
      theme.updateCustomToken(tokenName, value);
      setCSSToken(tokenName, value);
    } else {
      console.warn(`Invalid token value for ${tokenName}:`, validation.error);
    }
  }, [theme]);

  const handlePresetApply = useCallback((presetName: keyof typeof THEME_PRESETS) => {
    const preset = THEME_PRESETS[presetName];
    Object.entries(preset.tokens).forEach(([tokenName, value]) => {
      theme.updateCustomToken(tokenName, value);
      setCSSToken(tokenName, value);
    });
  }, [theme]);

  const handleExportTheme = useCallback(() => {
    const themeData = theme.exportTheme();
    const blob = new Blob([themeData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `theme-${theme.resolvedTheme}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [theme]);

  const handleImportTheme = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            theme.importTheme(content);
          } catch (error) {
            alert("Failed to import theme: " + error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [theme]);

  const categories = Object.keys(TOKEN_CATEGORIES);

  return (
    <div className="min-h-screen bg-surface-bg text-text-primary">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-surface-card border-r border-surface-stroke overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="heading-2">Theme Playground</h1>
                <ThemeSwitcher size="sm" />
              </div>
              <p className="caption-text text-text-secondary">
                Edit design tokens in real-time and see changes across all components.
              </p>
            </div>

            {/* Theme Actions */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleExportTheme}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-surface-stroke hover:bg-surface-elevation transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={handleImportTheme}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-surface-stroke hover:bg-surface-elevation transition-colors"
                >
                  Import
                </button>
              </div>
              <button
                onClick={theme.resetCustomTokens}
                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-stroke hover:bg-surface-elevation transition-colors text-feedback-danger"
              >
                Reset to Default
              </button>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-surface-stroke bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Theme Presets */}
            <ThemePresetSelector onPresetApply={handlePresetApply} />

            {/* Token Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-secondary">Token Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'bg-brand text-white'
                        : 'hover:bg-surface-elevation'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Token Editor */}
            {activeCategory && (
              <TokenEditor
                category={activeCategory}
                tokens={TOKEN_CATEGORIES[activeCategory as keyof typeof TOKEN_CATEGORIES]}
                onTokenChange={handleTokenChange}
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="heading-1">Design System Preview</h2>
                  <p className="body-text text-text-secondary">
                    All components automatically update as you modify design tokens.
                  </p>
                </div>

                <Card className="p-6">
                  <ComponentPreview />
                </Card>

                {/* Theme Info */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="heading-3">Current Theme</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Mode:</span>
                        <span className="ml-2 font-medium">{theme.mode}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Resolved:</span>
                        <span className="ml-2 font-medium">{theme.resolvedTheme}</span>
                      </div>
                      <div>
                        <span className="text-text-secondary">Custom tokens:</span>
                        <span className="ml-2 font-medium">{Object.keys(theme.customTokens).length}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Design System/Theme Playground",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Theme Playground

An interactive environment for designing and testing design tokens in real-time.

## Features

- **Real-time token editing**: Modify colors, spacing, typography, and other design tokens
- **Theme presets**: Quick access to predefined theme configurations
- **Live component preview**: See how changes affect all design system components
- **Import/Export**: Save and share custom themes
- **Theme switching**: Toggle between light, dark, and system themes
- **Token validation**: Automatic validation of token values

## Usage

1. Select a token category from the sidebar
2. Modify token values using the color pickers and inputs
3. See changes reflected immediately in the component preview
4. Use theme presets for quick theme switching
5. Export your custom theme for use in production

## Token Categories

- **Brand**: Primary brand colors and accents
- **Surface**: Background, card, and border colors
- **Text**: Typography colors for different content types
- **Feedback**: Success, warning, danger, and info colors
- **Spacing**: Consistent spacing scale
- **Radius**: Border radius values
- **Typography**: Font sizes and weights
        `
      }
    }
  },
};

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: () => (
    <ThemeProvider enableCustomTokens={true}>
      <ThemePlaygroundContent />
    </ThemeProvider>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="dark" enableCustomTokens={true}>
      <div data-theme="dark">
        <ThemePlaygroundContent />
      </div>
    </ThemeProvider>
  ),
};

export const LightTheme: Story = {
  render: () => (
    <ThemeProvider defaultTheme="light" enableCustomTokens={true}>
      <div data-theme="light">
        <ThemePlaygroundContent />
      </div>
    </ThemeProvider>
  ),
};
