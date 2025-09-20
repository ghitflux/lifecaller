import type { ComponentType, HTMLAttributes } from "react";
import {
  MicOff,
  PauseCircle,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  PlayCircle,
} from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

export type CallAction =
  | "atender"
  | "finalizar"
  | "transferir"
  | "aguardar"
  | "retomar"
  | "mutar";

const actionConfig: Record<CallAction, { label: string; icon: ComponentType<{ size?: number }>; variant?: "primary" | "ghost" | "danger" }> = {
  atender: { label: "Atender", icon: PhoneCall, variant: "primary" },
  finalizar: { label: "Finalizar", icon: PhoneOff, variant: "danger" },
  transferir: { label: "Transferir", icon: PhoneForwarded, variant: "ghost" },
  aguardar: { label: "Pausar", icon: PauseCircle, variant: "ghost" },
  retomar: { label: "Retomar", icon: PlayCircle, variant: "primary" },
  mutar: { label: "Mutar", icon: MicOff, variant: "ghost" },
};

export type CallControlsProps = HTMLAttributes<HTMLDivElement> & {
  availableActions: ReadonlyArray<CallAction>;
  disabledActions?: ReadonlyArray<CallAction>;
  busy?: boolean;
  onAction?: (action: CallAction) => void;
};

export function CallControls({
  availableActions,
  disabledActions = [] as ReadonlyArray<CallAction>,
  busy,
  onAction,
  className,
  ...props
}: CallControlsProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)} {...props}>
      <span className="text-xs uppercase tracking-wide text-canvas.mut">Controles da chamada</span>
      <div className="flex flex-wrap gap-3">
        {availableActions.map((action) => {
          const cfg = actionConfig[action];
          const Icon = cfg.icon;
          const disabled = busy || disabledActions.includes(action);

          return (
            <Button
              key={action}
              variant={cfg.variant}
              className="gap-2"
              disabled={disabled}
              onClick={() => onAction?.(action)}
            >
              <Icon size={18} />
              {cfg.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
