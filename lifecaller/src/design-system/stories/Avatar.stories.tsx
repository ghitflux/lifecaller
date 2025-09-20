import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, type AvatarProps } from "../components/Avatar";
import { StoryBlock } from "./_shared";

const meta: Meta<AvatarProps> = {
  title: "Design System/Avatar",
  component: Avatar,
  parameters: { layout: "fullscreen" },
  args: {
    name: "Marina Paiva",
    size: "md",
  },
};
export default meta;

type Story = StoryObj<AvatarProps>;

export const Playground: Story = {
  render: (args) => (
    <StoryBlock title="Avatares" description="Escalas disponíveis para o identificador visual.">
      <div className="flex items-center gap-4">
        <Avatar {...args} size="sm" />
        <Avatar {...args} size="md" />
        <Avatar {...args} size="lg" />
      </div>
    </StoryBlock>
  ),
};
