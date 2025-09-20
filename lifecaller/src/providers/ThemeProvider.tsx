import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  customTokens: Record<string, string>;
}

interface ThemeContextValue extends ThemeState {
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  updateCustomToken: (key: string, value: string) => void;
  resetCustomTokens: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'lifecaller-theme';
const CUSTOM_TOKENS_KEY = 'lifecaller-custom-tokens';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      return stored as ThemeMode;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return 'system';
}

function getStoredCustomTokens(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(CUSTOM_TOKENS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load custom tokens from localStorage:', error);
    return {};
  }
}

function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  enableCustomTokens?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableCustomTokens = true
}: ThemeProviderProps) {
  const [state, setState] = useState<ThemeState>(() => {
    const mode = getStoredTheme() || defaultTheme;
    const customTokens = enableCustomTokens ? getStoredCustomTokens() : {};
    return {
      mode,
      resolvedTheme: resolveTheme(mode),
      customTokens,
    };
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (state.mode === 'system') {
        setState(prev => ({
          ...prev,
          resolvedTheme: getSystemTheme(),
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('theme-dark', 'theme-light');
    root.removeAttribute('data-theme');

    // Apply new theme
    root.classList.add(`theme-${state.resolvedTheme}`);
    root.setAttribute('data-theme', state.resolvedTheme);

    // Apply custom tokens
    Object.entries(state.customTokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [state.resolvedTheme, state.customTokens]);

  // Persist theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, state.mode);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [state.mode]);

  // Persist custom tokens
  useEffect(() => {
    if (!enableCustomTokens || typeof window === 'undefined') return;
    try {
      localStorage.setItem(CUSTOM_TOKENS_KEY, JSON.stringify(state.customTokens));
    } catch (error) {
      console.warn('Failed to save custom tokens to localStorage:', error);
    }
  }, [state.customTokens, enableCustomTokens]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setState(prev => ({
      ...prev,
      mode,
      resolvedTheme: resolveTheme(mode),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newMode = prev.resolvedTheme === 'dark' ? 'light' : 'dark';
      return {
        ...prev,
        mode: newMode,
        resolvedTheme: newMode,
      };
    });
  }, []);

  const updateCustomToken = useCallback((key: string, value: string) => {
    if (!enableCustomTokens) return;
    setState(prev => ({
      ...prev,
      customTokens: {
        ...prev.customTokens,
        [key]: value,
      },
    }));
  }, [enableCustomTokens]);

  const resetCustomTokens = useCallback(() => {
    if (!enableCustomTokens) return;
    setState(prev => ({
      ...prev,
      customTokens: {},
    }));

    // Remove custom properties from DOM
    const root = document.documentElement;
    Object.keys(state.customTokens).forEach(key => {
      root.style.removeProperty(`--${key}`);
    });
  }, [enableCustomTokens, state.customTokens]);

  const exportTheme = useCallback(() => {
    const themeData = {
      mode: state.mode,
      customTokens: state.customTokens,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(themeData, null, 2);
  }, [state.mode, state.customTokens]);

  const importTheme = useCallback((themeData: string) => {
    try {
      const parsed = JSON.parse(themeData);

      if (parsed.mode && ['dark', 'light', 'system'].includes(parsed.mode)) {
        setState(prev => ({
          ...prev,
          mode: parsed.mode,
          resolvedTheme: resolveTheme(parsed.mode),
          customTokens: enableCustomTokens && parsed.customTokens ? parsed.customTokens : prev.customTokens,
        }));
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
      throw new Error('Invalid theme data format');
    }
  }, [enableCustomTokens]);

  const value: ThemeContextValue = {
    ...state,
    setTheme,
    toggleTheme,
    updateCustomToken,
    resetCustomTokens,
    exportTheme,
    importTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hooks
export function useThemeMode() {
  const { mode, setTheme } = useTheme();
  return [mode, setTheme] as const;
}

export function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
}

export function useCustomTokens() {
  const { customTokens, updateCustomToken, resetCustomTokens } = useTheme();
  return {
    tokens: customTokens,
    updateToken: updateCustomToken,
    resetTokens: resetCustomTokens,
  };
}

// Theme switcher component
interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ThemeSwitcher({ className, size = 'md' }: ThemeSwitcherProps) {
  const { mode, setTheme, resolvedTheme } = useTheme();

  const buttonClasses = [
    'inline-flex items-center justify-center rounded-lg border border-stroke transition-colors',
    'hover:bg-card focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2',
    size === 'sm' && 'h-8 w-8 text-xs',
    size === 'md' && 'h-10 w-10 text-sm',
    size === 'lg' && 'h-12 w-12 text-base',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="flex items-center rounded-lg border border-stroke p-1">
      {(['system', 'light', 'dark'] as const).map((themeMode) => (
        <button
          key={themeMode}
          onClick={() => setTheme(themeMode)}
          className={[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            mode === themeMode
              ? 'bg-brand text-white'
              : 'text-muted hover:text-text hover:bg-card',
          ].join(' ')}
          aria-pressed={mode === themeMode}
        >
          {themeMode === 'system' ? 'Auto' : themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
        </button>
      ))}
    </div>
  );
}

// Theme debug component for development
export function ThemeDebugger() {
  const theme = useTheme();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-stroke rounded-lg p-4 text-xs font-mono shadow-lg">
      <div className="space-y-1">
        <div>Mode: <span className="text-brand">{theme.mode}</span></div>
        <div>Resolved: <span className="text-brand">{theme.resolvedTheme}</span></div>
        <div>Custom tokens: <span className="text-brand">{Object.keys(theme.customTokens).length}</span></div>
      </div>
    </div>
  );
}