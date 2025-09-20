import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/cn";

const styles = cva(
  [
    // Base styles using standardized tokens
    "inline-flex items-center justify-center",
    "font-medium transition-all duration-normal",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
    "focus:ring-offset-surface-bg",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-brand text-text-inverse",
          "hover:opacity-90 active:scale-95",
          "shadow-soft hover:shadow-md",
        ],
        ghost: [
          "bg-transparent text-text-primary",
          "border border-surface-stroke",
          "hover:bg-surface-card hover:text-text-primary",
          "active:bg-surface-elevation",
        ],
        danger: [
          "bg-feedback-danger text-text-inverse",
          "hover:opacity-90 active:scale-95",
          "shadow-soft hover:shadow-md",
        ],
        secondary: [
          "bg-surface-card text-text-primary",
          "border border-surface-stroke",
          "hover:bg-surface-elevation",
          "active:bg-surface-stroke",
        ],
      },
      size: {
        sm: [
          "h-button-sm px-3",
          "text-sm rounded-lg",
        ],
        md: [
          "h-button-md px-4",
          "text-sm rounded-xl",
        ],
        lg: [
          "h-button-lg px-6",
          "text-base rounded-xl",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof styles> & {
  style?: CSSProperties;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export function Button({
  className,
  variant,
  size,
  style,
  loading = false,
  icon,
  iconPosition = "left",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(styles({ variant, size }), className)}
      style={style}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2">{icon}</span>
      )}

      {children}

      {icon && iconPosition === "right" && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
}
