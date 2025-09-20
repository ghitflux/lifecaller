import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

export type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: string;
  className?: string;
};

export function MetricCard({ label, value, hint, icon, accent = "rgba(76, 141, 255, 0.12)", className }: MetricCardProps) {
  return (
    <Card className={cn("flex items-center gap-4 p-5", className)}>
      {icon ? (
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: accent, color: "var(--brand)" }}
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-canvas.mut">{label}</span>
        <span className="text-2xl font-semibold text-canvas.text">{value}</span>
        {hint ? <span className="text-xs text-canvas.mut">{hint}</span> : null}
      </div>
    </Card>
  );
}
