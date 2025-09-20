import type { Meta, StoryObj } from "@storybook/react";
import { Surface, type SurfaceProps } from "../components/Surface";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { StoryBlock, StoryGrid } from "./_shared";

const meta: Meta<SurfaceProps> = {
  title: "Design System/Surface",
  component: Surface,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Resumo diário",
    description: "Indicadores atualizados a cada 5 minutos.",
    footer: "Atualizado às 09:42",
  },
};
export default meta;

type Story = StoryObj<SurfaceProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Superfície" description="Bloco principal com cartão e cabeçalho.">
      <Surface
        {...args}
        actions={<Button size="sm">Exportar</Button>}
      >
        <StoryGrid>
          <Card className="h-32 flex items-center justify-center">Slot A</Card>
          <Card className="h-32 flex items-center justify-center">Slot B</Card>
        </StoryGrid>
      </Surface>
    </StoryBlock>
  ),
};
