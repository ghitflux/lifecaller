import type { Meta, StoryObj } from "@storybook/react";
import { StoryBlock, StoryGrid } from "./_shared";

const meta: Meta = {
  title: "Design System/Cores",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const TOKENS: Array<{ name: string; cssVar: string }> = [
  { name: "Brand", cssVar: "--brand" },
  { name: "Background", cssVar: "--bg" },
  { name: "Card", cssVar: "--card" },
  { name: "Elevation", cssVar: "--elev" },
  { name: "Stroke", cssVar: "--stroke" },
  { name: "Texto", cssVar: "--text" },
  { name: "Mutado", cssVar: "--muted" },
  { name: "Status OK", cssVar: "--ok" },
  { name: "Status Alerta", cssVar: "--warn" },
  { name: "Status Perigo", cssVar: "--danger" },
  { name: "Status Info", cssVar: "--info" },
  { name: "Status Fila", cssVar: "--queued" },
];

export const Paleta: Story = {
  render: () => (
    <StoryBlock title="Tokens de cor" description="Palette dominante do produto.">
      <StoryGrid cols={3}>
        {TOKENS.map((token) => (
          <div key={token.cssVar} className="space-y-2">
            <div
              className="h-20 rounded-2xl border border-theme"
              style={{ background: "var(" + token.cssVar + ")" }}
            />
            <div className="ds-caption text-[var(--muted)]">{token.name}</div>
            <div className="ds-caption text-[var(--muted)]">{token.cssVar}</div>
          </div>
        ))}
      </StoryGrid>
    </StoryBlock>
  ),
};
