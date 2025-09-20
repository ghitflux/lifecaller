import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  src?: string;
  size?: keyof typeof sizeMap;
};

export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-brand/10 text-brand border border-brand/30 uppercase",
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {src ? <img src={src} alt={name} className="h-full w-full rounded-full object-cover" /> : initials}
    </div>
  );
}
