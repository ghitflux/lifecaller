import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { StoryBlock, StoryGrid } from "./_shared";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Showcase: Story = {
  render: () => (
    <div className="space-y-6">
      <StoryBlock title="Card padrão" description="Container com stroke suave e sombra sutil.">
        <Card className="space-y-2">
          <Heading level="h3">Título do card</Heading>
          <p className="ds-body text-[var(--muted)]">Use o card para agrupar métricas, formulários e caixas de conteúdo.</p>
        </Card>
      </StoryBlock>
      <StoryBlock title="Grid" description="Cards alinhados sobre o mesmo tema.">
        <StoryGrid>
          <Card className="h-32 flex items-center justify-center">Slot A</Card>
          <Card className="h-32 flex items-center justify-center">Slot B</Card>
          <Card className="h-32 flex items-center justify-center">Slot C</Card>
          <Card className="h-32 flex items-center justify-center">Slot D</Card>
        </StoryGrid>
      </StoryBlock>
    </div>
  ),
};
