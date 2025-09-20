import type { Meta, StoryObj } from "@storybook/react";
import { TrendingUp, Users, Clock3, FileText } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { StoryBlock, StoryGrid } from "./_shared";

const meta: Meta<typeof MetricCard> = {
  title: "Design System/MetricCard",
  component: MetricCard,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof MetricCard>;

export const Dashboard: Story = {
  render: () => (
    <StoryBlock title="Cards de métrica" description="Indicadores destacados do dashboard.">
      <StoryGrid cols={4}>
        <MetricCard label="Pendentes" value="45" hint="Aguardando atendimento" icon={<Users size={20} />} />
        <MetricCard label="Em Atendimento" value="23" hint="Sendo processados" icon={<TrendingUp size={20} />} />
        <MetricCard label="Aguardando Aprovação" value="12" hint="Calculista pendente" icon={<Clock3 size={20} />} />
        <MetricCard label="Contratos" value="156" hint="Hoje" icon={<FileText size={20} />} />
      </StoryGrid>
    </StoryBlock>
  ),
};
