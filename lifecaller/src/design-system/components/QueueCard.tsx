import { Phone } from "lucide-react";
import { Card } from "./Card";
import { StatusBadge, type StatusBadgeProps } from "./StatusBadge";
import { Button } from "./Button";

export type QueueCardAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "ghost" | "danger";
};

export type QueueCardProps = {
  title: string;
  subtitle?: string;
  phone?: string;
  notes?: string;
  status: StatusBadgeProps["variant"];
  onClaim?: () => void;
  onRelease?: () => void;
  actions?: QueueCardAction[];
};

export function QueueCard({
  title,
  subtitle,
  phone,
  notes,
  status,
  onClaim,
  onRelease,
  actions = [],
}: QueueCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle ? <div className="text-sm text-canvas.mut">{subtitle}</div> : null}
          {phone ? (
            <div className="text-sm text-canvas.mut mt-1 flex items-center gap-1.5">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phone}
            </div>
          ) : null}
        </div>
        <StatusBadge variant={status} />
      </div>

      {notes ? <div className="text-sm text-canvas.mut line-clamp-2">Notas: {notes}</div> : null}

      {(onClaim || onRelease || actions.length) ? (
        <div className="flex items-center gap-2 pt-1">
          {onClaim ? <Button onClick={onClaim}>Pegar</Button> : null}
          {onRelease ? (
            <Button variant="ghost" onClick={onRelease}>
              Liberar
            </Button>
          ) : null}
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant ?? "ghost"} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
