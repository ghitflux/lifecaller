import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NoteInput, type NoteInputProps } from "../components/NoteInput";
import { StoryBlock } from "./_shared";

const meta: Meta<NoteInputProps> = {
  title: "Design System/NoteInput",
  component: NoteInput,
  parameters: { layout: "fullscreen" },
  args: {
    placeholder: "Registre a tratativa...",
  },
};
export default meta;

type Story = StoryObj<NoteInputProps>;

export const Playground: Story = {
  render: (args) => {
    const [history, setHistory] = useState<string[]>([]);
    return (
      <StoryBlock title="Notas rápidas" description="Input com tokens de superfície e borda.">
        <NoteInput
          {...args}
          onSubmit={(value) => {
            setHistory((prev) => [value, ...prev].slice(0, 3));
          }}
        />
        <div className="space-y-2">
          <p className="ds-caption text-[var(--muted)]">Últimas notas</p>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="card p-3 ds-body text-[var(--text)]">
                {item}
              </div>
            ))}
            {history.length === 0 ? <p className="ds-caption text-[var(--muted)]">Nenhuma nota ainda.</p> : null}
          </div>
        </div>
      </StoryBlock>
    );
  },
};
