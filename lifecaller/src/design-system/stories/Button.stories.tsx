import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";
import { StoryBlock } from "./_shared";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Showcase: StoryObj<typeof Button> = {
  render: () => (
    <div className="space-y-6">
      <StoryBlock title="Botões básicos" description="Variações principais do sistema.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primário</Button>
          <Button variant="ghost">Secundário</Button>
          <Button variant="danger">Crítico</Button>
        </div>
      </StoryBlock>
      <StoryBlock title="Tamanhos" description="Altura e tipografia seguem o token de escala.">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
        </div>
      </StoryBlock>
    </div>
  ),
};
