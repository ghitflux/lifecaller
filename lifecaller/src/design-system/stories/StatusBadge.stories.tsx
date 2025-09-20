import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge, type StatusBadgeProps } from "../components/StatusBadge";
import { StoryBlock } from "./_shared";

const meta: Meta<StatusBadgeProps> = {
  title: "Design System/StatusBadge",
  component: StatusBadge,
  parameters: { layout: "fullscreen" },
  args: { variant: "pendente" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "pendente",
        "em_atendimento",
        "aguardando_aprovacao",
        "aprovado",
        "reprovado",
        "contrato_formalizado",
        "pago",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<StatusBadgeProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Badges de status" description="Estados oficiais da esteira.">
      <div className="flex flex-wrap gap-3">
        <StatusBadge {...args} />
        <StatusBadge variant="em_atendimento" />
        <StatusBadge variant="aguardando_aprovacao" />
        <StatusBadge variant="aprovado" />
        <StatusBadge variant="reprovado" />
        <StatusBadge variant="contrato_formalizado" />
        <StatusBadge variant="pago" />
      </div>
    </StoryBlock>
  ),
};
