import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties, ReactNode } from "react";
import { Check, ClipboardCheck, Clock3, Headset, Hourglass, Wallet, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type StatusVariant =
  | "pendente"
  | "em_atendimento"
  | "aguardando_aprovacao"
  | "aprovado"
  | "reprovado"
  | "contrato_formalizado"
  | "pago";

const statusStyles = cva(
  [
    // Base styles using standardized tokens
    "inline-flex items-center justify-center",
    "text-xs font-medium",
    "border transition-all duration-normal",
    "select-none",
  ],
  {
    variants: {
      variant: {
        pendente: "status-pendente",
        em_atendimento: "status-atendimento",
        aguardando_aprovacao: "status-aguardo",
        aprovado: "status-aprovado",
        reprovado: "status-reprovado",
        contrato_formalizado: "status-formalizado",
        pago: "status-pago font-semibold",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        md: "px-2.5 py-1 text-xs rounded-lg",
        lg: "px-3 py-1.5 text-sm rounded-lg",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-lg",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "pill",
    },
  }
);

const statusLabels: Record<StatusVariant, string> = {
  pendente: "Pendente",
  em_atendimento: "Em Atendimento",
  aguardando_aprovacao: "Aguardando Aprovação",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  contrato_formalizado: "Contrato Formalizado",
  pago: "Pago",
};

const statusIcons: Record<StatusVariant, LucideIcon> = {
  pendente: Clock3,
  em_atendimento: Headset,
  aguardando_aprovacao: Hourglass,
  aprovado: Check,
  reprovado: XCircle,
  contrato_formalizado: ClipboardCheck,
  pago: Wallet,
};

export type StatusBadgeProps = VariantProps<typeof statusStyles> & {
  variant: StatusVariant;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  showIcon?: boolean;
  customLabel?: string;
};

export function StatusBadge({
  variant,
  size,
  shape,
  children,
  className,
  style,
  showIcon = false,
  customLabel,
}: StatusBadgeProps) {
  const label = children ?? customLabel ?? statusLabels[variant];
  const Icon = statusIcons[variant];

  return (
    <span
      className={cn(statusStyles({ variant, size, shape }), className)}
      style={style}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {showIcon && (
        <Icon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

// Preset status badge variants for common use cases
export function StatusBadgePendente(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="pendente" />;
}

export function StatusBadgeEmAtendimento(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="em_atendimento" />;
}

export function StatusBadgeAguardandoAprovacao(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="aguardando_aprovacao" />;
}

export function StatusBadgeAprovado(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="aprovado" />;
}

export function StatusBadgeReprovado(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="reprovado" />;
}

export function StatusBadgeContratoFormalizado(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="contrato_formalizado" />;
}

export function StatusBadgePago(props: Omit<StatusBadgeProps, "variant">) {
  return <StatusBadge {...props} variant="pago" />;
}
