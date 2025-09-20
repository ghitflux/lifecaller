import type { Meta, StoryObj } from "@storybook/react";
import { QueueCard, type QueueCardProps } from "../components/QueueCard";
import { StoryBlock } from "./_shared";

const meta: Meta<QueueCardProps> = {
  title: "Design System/QueueCard",
  component: QueueCard,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Maria Silva Santos",
    subtitle: "CPF: 123.456.789-01 • Matrícula: 12345",
    phone: "(11) 99999-9999",
    status: "aguardando_aprovacao",
    notes: "Cliente aguardando confirmação do supervisor.",
  },
};
export default meta;

type Story = StoryObj<QueueCardProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Card de fila" description="Resumo do atendimento em andamento.">
      <QueueCard
        {...args}
        onClaim={() => console.log("claim")}
        actions={[
          { label: "Detalhes", onClick: () => console.log("detalhes") },
          { label: "Encaminhar", onClick: () => console.log("forward") },
        ]}
      />
    </StoryBlock>
  ),
};
