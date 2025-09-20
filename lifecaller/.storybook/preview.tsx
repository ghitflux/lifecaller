import React, { useEffect, useMemo } from "react";
import type { Decorator, Preview } from "@storybook/react";
import "../src/styles/index.css";

export const globalTypes = {
  fontFamily: {
    name: "Fonte (Sans)",
    description: "Escolha a fonte padrão (sans)",
    defaultValue: "Gogh",
    toolbar: {
      icon: "typography",
      items: ["Gogh", "Inter", "JetBrains Mono"],
      dynamicTitle: true,
    },
  },
  density: {
    name: "Densidade",
    defaultValue: "comfortable",
    toolbar: { icon: "contrast", items: ["compact", "cozy", "comfortable"] },
  },
};

const readCssVar = (name: string, fallback: string) => {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

const ThemeShell: React.FC<{ context: Parameters<Decorator>[1]; children: React.ReactNode }> = ({ context, children }) => {
  const { globals, parameters } = context;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const font = String(globals.fontFamily || "Gogh");
    const fontMap: Record<string, string> = {
      Gogh: "'Gogh'",
      Inter: "'Inter'",
      "JetBrains Mono": "'JetBrains Mono'",
    };
    root.style.setProperty("--fontSans", fontMap[font] || "'Gogh'");

    const density = String(globals.density || "comfortable");
    const base = density === "compact" ? "15px" : density === "cozy" ? "15.5px" : "16px";
    root.style.setProperty("--fontSizeMd", base);
  }, [globals.fontFamily, globals.density]);

  const bg = readCssVar("--bg", "#0F1729");
  const text = readCssVar("--text", "#E8EEF7");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousBg = document.body.style.backgroundColor;
    const previousColor = document.body.style.color;
    document.body.style.backgroundColor = bg;
    document.body.style.color = text;
    return () => {
      document.body.style.backgroundColor = previousBg;
      document.body.style.color = previousColor;
    };
  }, [bg, text]);

  const layout = parameters.layout ?? "fullscreen";
  const outerStyle = useMemo(() => ({
    background: bg,
    color: text,
    minHeight: "100vh",
    margin: 0,
    padding: layout === "centered" ? "48px" : "56px",
    display: layout === "centered" ? "flex" : "block",
    alignItems: layout === "centered" ? "center" : undefined,
    justifyContent: layout === "centered" ? "center" : undefined,
  }), [bg, text, layout]);

  const innerStyle = useMemo(() => (
    layout === "centered"
      ? { maxWidth: "960px", width: "100%" }
      : { maxWidth: "1200px", margin: "0 auto", width: "100%" }
  ), [layout]);

  return (
    <div style={outerStyle} className="sb-theme-shell">
      <div style={innerStyle} className="sb-theme-inner space-y-6">
        {children}
      </div>
    </div>
  );
};

const withGlobals: Decorator = (Story, context) => (
  <ThemeShell context={context}>
    <Story />
  </ThemeShell>
);

export const decorators = [withGlobals];

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    a11y: { element: "#root", config: {}, options: {} },
  },
};

export default preview;
