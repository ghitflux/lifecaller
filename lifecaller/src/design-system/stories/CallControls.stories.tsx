import type { Meta, StoryObj } from "@storybook/react";
import { CallControls, type CallControlsProps } from "../components/CallControls";
import { StoryBlock } from "./_shared";

const ALL_ACTIONS: CallControlsProps["availableActions"] = [
  "atender",
  "aguardar",
  "retomar",
  "transferir",
  "mutar",
  "finalizar",
];

const meta: Meta<CallControlsProps> = {
  title: "Design System/CallControls",
  component: CallControls,
  parameters: { layout: "fullscreen" },
  args: {
    availableActions: ALL_ACTIONS,
    disabledActions: ["retomar"],
  },
};
export default meta;

type Story = StoryObj<CallControlsProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Controles da chamada" description="Ações disponíveis para o atendente.">
      <CallControls {...args} onAction={(a) => console.log(a)} />
    </StoryBlock>
  ),
};
