import type { Meta, StoryObj } from "@storybook/react";
import { AttendantCard, type AttendantCardProps } from "../components/AttendantCard";
import { StoryBlock } from "./_shared";

const meta: Meta<AttendantCardProps> = {
  title: "Design System/AttendantCard",
  component: AttendantCard,
  parameters: { layout: "fullscreen" },
  args: {
    name: "Marina Paiva",
    role: "Atendente — Pós-Sim",
    status: "em_atendimento",
    queue: "Pós-Sim",
    currentCase: "#LC-1045",
    since: "09:12",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["disponivel", "em_atendimento", "pausado", "offline"],
    },
  },
};
export default meta;

type Story = StoryObj<AttendantCardProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Resumo do atendente" description="Estado atual, fila e próximo passo.">
      <AttendantCard {...args} />
    </StoryBlock>
  ),
};
