import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";
import { QueueCard } from "../components/QueueCard";
import { AttendantCard } from "../components/AttendantCard";
import { CallControls } from "../components/CallControls";
import { NoteInput } from "../components/NoteInput";
import { MetricCard } from "../components/MetricCard";
import { StoryBlock, StoryGrid } from "./_shared";
import { Heading } from "../components/Heading";

const meta: Meta = {
  title: "Design System/Overview",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <Heading level="h1" className="text-[var(--text)]">Dashboard de supervisão</Heading>
      <StoryBlock title="Indicadores" description="Visão geral das filas.">
        <StoryGrid cols={4}>
          <MetricCard label="Pendentes" value="45" hint="Aguardando atendimento" />
          <MetricCard label="Em Atendimento" value="23" hint="Sendo processados" />
          <MetricCard label="Aguardando Aprovação" value="12" hint="Calculista" />
          <MetricCard label="Contratos" value="156" hint="Hoje" />
        </StoryGrid>
      </StoryBlock>

      <StoryBlock title="Fila em destaque" description="Item detalhado com ações.">
        <QueueCard
          title="Maria Silva Santos"
          subtitle="CPF: 123.456.789-01 • Matrícula: 12345"
          phone="(11) 99999-9999"
          status="aguardando_aprovacao"
          notes="Cliente aguardando confirmação do supervisor."
          actions={[
            { label: "Detalhes", onClick: () => console.log("detalhes") },
            { label: "Encaminhar", onClick: () => console.log("forward") },
          ]}
        />
      </StoryBlock>

      <StoryBlock title="Equipe" description="Situação atual dos operadores.">
        <StoryGrid cols={3}>
          <AttendantCard
            name="Marina Paiva"
            role="Atendente — Pós-Sim"
            status="em_atendimento"
            queue="Pós-Sim"
            since="09:12"
          />
          <AttendantCard
            name="João Santos"
            role="Calculista"
            status="pausado"
            queue="Calculista"
            since="08:45"
          />
          <AttendantCard
            name="Ana Costa"
            role="Gerente"
            status="disponivel"
            queue="Fechamento"
            since="09:00"
          />
        </StoryGrid>
      </StoryBlock>

      <StoryBlock title="Ações e notas" description="Controles alinhados ao cartão.">
        <div className="space-y-4">
          <CallControls
            availableActions={["atender", "aguardar", "retomar", "transferir", "mutar", "finalizar"]}
            disabledActions={["retomar"]}
            onAction={(action) => console.log(action)}
          />
          <NoteInput onSubmit={(value) => console.log(value)} />
          <div className="flex gap-3">
            <Button>Atender</Button>
            <Button variant="ghost">Detalhes</Button>
            <Button variant="danger">Finalizar</Button>
          </div>
        </div>
      </StoryBlock>
    </div>
  ),
};
