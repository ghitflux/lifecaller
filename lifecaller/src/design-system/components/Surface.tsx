import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/cn";

const surfaceStyles = cva(
  [
    // Base styles using standardized tokens
    "border text-text-primary",
    "transition-all duration-normal",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-surface-card border-surface-stroke",
          "shadow-soft",
        ],
        elevated: [
          "bg-surface-card border-surface-stroke",
          "shadow-lg hover:shadow-xl",
        ],
        flat: [
          "bg-surface-card border-surface-stroke",
          "shadow-none",
        ],
        success: [
          "bg-surface-card border-feedback-success/40",
          "shadow-soft",
        ],
        warning: [
          "bg-surface-card border-feedback-warning/40",
          "shadow-soft",
        ],
        danger: [
          "bg-surface-card border-feedback-danger/40",
          "shadow-soft",
        ],
        info: [
          "bg-surface-card border-feedback-info/40",
          "shadow-soft",
        ],
      },
      size: {
        sm: "p-md rounded-lg",
        md: "p-lg rounded-xl",
        lg: "p-xl rounded-xl",
        none: "p-0 rounded-xl",
      },
      interactive: {
        true: "cursor-pointer hover:bg-surface-elevation",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export type SurfaceProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof surfaceStyles> & {
    title?: string;
    description?: string;
    actions?: ReactNode;
    footer?: ReactNode;
    style?: CSSProperties;
    as?: "div" | "section" | "article" | "aside";
  };

export function Surface({
  title,
  description,
  actions,
  footer,
  variant,
  size,
  interactive,
  className,
  children,
  style,
  as: Component = "section",
  ...props
}: SurfaceProps) {
  const hasHeader = title || description || actions;

  return (
    <Component
      className={cn(surfaceStyles({ variant, size, interactive }), className)}
      style={style}
      {...props}
    >
      {hasHeader && (
        <header className="mb-lg flex flex-col gap-sm md:flex-row md:items-start md:justify-between">
          <div className="space-y-xs">
            {title && (
              <h3 className="heading-3 text-text-primary leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="caption-text text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-sm flex-shrink-0">
              {actions}
            </div>
          )}
        </header>
      )}

      {children && (
        <div className={cn("space-y-md", hasHeader && "mt-lg")}>
          {children}
        </div>
      )}

      {footer && (
        <footer className="mt-lg pt-md border-t border-surface-stroke">
          <div className="caption-text text-text-secondary">
            {footer}
          </div>
        </footer>
      )}
    </Component>
  );
}

// Surface composition components
export function SurfaceHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-lg flex flex-col gap-sm md:flex-row md:items-start md:justify-between", className)}
      {...props}
    />
  );
}

export function SurfaceTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("heading-3 text-text-primary leading-tight", className)}
      {...props}
    />
  );
}

export function SurfaceDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("caption-text text-text-secondary", className)}
      {...props}
    />
  );
}

export function SurfaceContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-md", className)}
      {...props}
    />
  );
}

export function SurfaceFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn("mt-lg pt-md border-t border-surface-stroke caption-text text-text-secondary", className)}
      {...props}
    />
  );
}
