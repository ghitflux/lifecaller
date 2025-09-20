import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Level = "h1" | "h2" | "h3" | "body" | "caption";
type Props = { level?: Level; as?: ElementType; className?: string; children?: ReactNode };

const map: Record<Level, string> = {
  h1: "ds-h1",
  h2: "ds-h2",
  h3: "ds-h3",
  body: "ds-body",
  caption: "ds-caption",
};

export function Heading({ level = "h1", as, className, children }: Props) {
  const Tag = (as || (level === "body" ? "p" : level === "caption" ? "p" : level)) as ElementType;
  return <Tag className={cn(map[level], className)}>{children}</Tag>;
}
