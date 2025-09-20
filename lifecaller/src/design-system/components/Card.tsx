import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/cn";

const cardStyles = cva(
  [
    // Base card styles using standardized tokens
    "bg-surface-card border border-surface-stroke",
    "transition-all duration-normal",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-xl shadow-soft",
          "p-lg",
        ],
        elevated: [
          "rounded-xl shadow-lg",
          "p-lg",
          "hover:shadow-xl",
        ],
        flat: [
          "rounded-lg shadow-none",
          "p-md",
          "border-2",
        ],
        interactive: [
          "rounded-xl shadow-soft",
          "p-lg",
          "hover:shadow-lg hover:bg-surface-elevation",
          "cursor-pointer",
        ],
      },
      size: {
        sm: "p-md",
        md: "p-lg",
        lg: "p-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardStyles> & {
    style?: CSSProperties;
    asChild?: boolean;
  };

export function Card({
  className,
  variant,
  size,
  style,
  asChild = false,
  ...props
}: CardProps) {
  const Component = asChild ? "div" : "div";

  return (
    <Component
      className={cn(cardStyles({ variant, size }), className)}
      style={style}
      {...props}
    />
  );
}

// Card sub-components for better composition
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-lg pb-md", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("heading-3 text-text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("caption-text text-text-secondary", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-lg pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-lg pt-0", className)}
      {...props}
    />
  );
}
