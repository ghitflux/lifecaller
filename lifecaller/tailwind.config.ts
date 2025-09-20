import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          DEFAULT: "var(--brand)",
          secondary: "var(--brand-secondary)",
          accent: "var(--brand-accent)",
        },
        // Surface colors
        surface: {
          bg: "var(--bg)",
          card: "var(--card)",
          elevation: "var(--elev)",
          stroke: "var(--stroke)",
          divider: "var(--divider)",
        },
        // Text colors
        text: {
          primary: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--muted)",
          inverse: "var(--text-inverse)",
        },
        // Feedback colors
        feedback: {
          success: "var(--success)",
          warning: "var(--warning)",
          danger: "var(--danger)",
          info: "var(--info)",
        },
        // Status colors
        status: {
          pendente: "var(--status-pendente)",
          atendimento: "var(--status-atendimento)",
          aguardo: "var(--status-aguardo)",
          aprovado: "var(--status-aprovado)",
          reprovado: "var(--status-reprovado)",
          formalizado: "var(--status-formalizado)",
          pago: "var(--status-pago)",
        },
        // Legacy canvas colors for backward compatibility
        canvas: {
          bg: "var(--bg)",
          card: "var(--card)",
          elev: "var(--elev)",
          stroke: "var(--stroke)",
          text: "var(--text)",
          muted: "var(--muted)",
          ok: "var(--success)",
          warn: "var(--warning)",
          danger: "var(--danger)",
          info: "var(--info)",
          queued: "var(--brand-accent)",
        },
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
        // Legacy
        xl2: "var(--radius-xl)",
      },
      borderWidth: {
        thin: "var(--border-width-thin)",
        DEFAULT: "var(--border-width)",
        thick: "var(--border-width-thick)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        soft: "var(--shadow-soft)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-md)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
      },
      fontWeight: {
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        extrabold: "var(--font-weight-extrabold)",
      },
      lineHeight: {
        tight: "var(--line-height-tight)",
        normal: "var(--line-height-normal)",
        base: "var(--line-height-base)",
        relaxed: "var(--line-height-relaxed)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)",
      },
      transitionTimingFunction: {
        DEFAULT: "var(--motion-easing)",
      },
      // Component-specific tokens
      height: {
        "button-sm": "var(--button-height-sm)",
        "button-md": "var(--button-height-md)",
        "button-lg": "var(--button-height-lg)",
        "input": "var(--input-height)",
      },
      // Animation
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--motion-normal) var(--motion-easing)",
        "slide-in-up": "slide-in-up var(--motion-normal) var(--motion-easing)",
        "slide-in-down": "slide-in-down var(--motion-normal) var(--motion-easing)",
        "scale-in": "scale-in var(--motion-normal) var(--motion-easing)",
      },
    },
  },
  plugins: [
    // Custom plugin for design system utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.surface': {
          backgroundColor: 'var(--card)',
          border: 'var(--border-width) solid var(--stroke)',
          borderRadius: 'var(--radius-lg)',
        },
        '.card': {
          backgroundColor: 'var(--card)',
          border: 'var(--card-border-width) solid var(--stroke)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--card-shadow)',
          padding: 'var(--card-padding)',
        },
        '.text-brand': {
          color: 'var(--brand)',
        },
        '.bg-brand': {
          backgroundColor: 'var(--brand)',
        },
        '.border-brand': {
          borderColor: 'var(--brand)',
        },
        // Typography utilities
        '.heading-1': {
          fontSize: 'var(--componentTypographyHeadingH1FontSize)',
          fontWeight: 'var(--componentTypographyHeadingH1FontWeight)',
          lineHeight: 'var(--componentTypographyHeadingH1LineHeight)',
        },
        '.heading-2': {
          fontSize: 'var(--componentTypographyHeadingH2FontSize)',
          fontWeight: 'var(--componentTypographyHeadingH2FontWeight)',
          lineHeight: 'var(--componentTypographyHeadingH2LineHeight)',
        },
        '.heading-3': {
          fontSize: 'var(--componentTypographyHeadingH3FontSize)',
          fontWeight: 'var(--componentTypographyHeadingH3FontWeight)',
          lineHeight: 'var(--componentTypographyHeadingH3LineHeight)',
        },
        '.body-text': {
          fontSize: 'var(--componentTypographyBodyFontSize)',
          fontWeight: 'var(--componentTypographyBodyFontWeight)',
          lineHeight: 'var(--componentTypographyBodyLineHeight)',
        },
        '.caption-text': {
          fontSize: 'var(--componentTypographyCaptionFontSize)',
          fontWeight: 'var(--componentTypographyCaptionFontWeight)',
          lineHeight: 'var(--componentTypographyCaptionLineHeight)',
        },
        // Status utilities
        '.status-pendente': {
          color: 'var(--status-pendente)',
          backgroundColor: 'var(--status-pendente-bg)',
          borderColor: 'var(--status-pendente)',
        },
        '.status-atendimento': {
          color: 'var(--status-atendimento)',
          backgroundColor: 'var(--status-atendimento-bg)',
          borderColor: 'var(--status-atendimento)',
        },
        '.status-aguardo': {
          color: 'var(--status-aguardo)',
          backgroundColor: 'var(--status-aguardo-bg)',
          borderColor: 'var(--status-aguardo)',
        },
        '.status-aprovado': {
          color: 'var(--status-aprovado)',
          backgroundColor: 'var(--status-aprovado-bg)',
          borderColor: 'var(--status-aprovado)',
        },
        '.status-reprovado': {
          color: 'var(--status-reprovado)',
          backgroundColor: 'var(--status-reprovado-bg)',
          borderColor: 'var(--status-reprovado)',
        },
        '.status-formalizado': {
          color: 'var(--status-formalizado)',
          backgroundColor: 'var(--status-formalizado-bg)',
          borderColor: 'var(--status-formalizado)',
        },
        '.status-pago': {
          color: 'var(--status-pago)',
          backgroundColor: 'var(--status-pago-bg)',
          borderColor: 'var(--status-pago)',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};

export default config;
