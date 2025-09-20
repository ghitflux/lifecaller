import type { HTMLAttributes } from "react";
import { Clock3, Headphones, PhoneCall } from "lucide-react";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";
import { cn } from "@/lib/cn";

export type AttendantStatus = "disponivel" | "em_atendimento" | "pausado" | "offline";

type StatusMeta = {
  label: string;
  variant: StatusBadgeProps["variant"];
};

const statusInfo: Record<AttendantStatus, StatusMeta> = {
  disponivel: { label: "Disponível", variant: "aprovado" },
  em_atendimento: { label: "Em atendimento", variant: "em_atendimento" },
  pausado: { label: "Pausado", variant: "aguardando_aprovacao" },
  offline: { label: "Offline", variant: "reprovado" },
};

export type AttendantCardProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  role: string;
  status: AttendantStatus;
  queue?: string;
  currentCase?: string;
  since?: string;
  avatarUrl?: string;
};

export function AttendantCard({
  name,
  role,
  status,
  queue,
  currentCase,
  since,
  avatarUrl,
  className,
  ...props
}: AttendantCardProps) {
  const { label, variant } = statusInfo[status];

  return (
    <Card className={cn("flex gap-4 p-4", className)} {...props}>
      <Avatar name={name} src={avatarUrl} size="lg" />
      <div className="flex flex-1 flex-col gap-3">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold leading-none">{name}</h4>
            <StatusBadge variant={variant}>{label}</StatusBadge>
          </div>
          <span className="text-sm text-canvas.mut">{role}</span>
        </header>
        <div className="grid gap-2 text-sm text-canvas.mut">
          {queue ? (
            <span className="inline-flex items-center gap-2">
              <Headphones size={16} className="text-brand" />
              Fila: <strong className="font-semibold text-canvas.text">{queue}</strong>
            </span>
          ) : null}
          {currentCase ? (
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={16} className="text-brand" />
              Chamado atual: <strong className="font-semibold text-canvas.text">{currentCase}</strong>
            </span>
          ) : null}
          {since ? (
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-brand" />
              Desde: <strong className="font-semibold text-canvas.text">{since}</strong>
            </span>
          ) : null}
        </div>
        <footer className="text-xs uppercase tracking-wide text-canvas.mut">{label}</footer>
      </div>
    </Card>
  );
}
