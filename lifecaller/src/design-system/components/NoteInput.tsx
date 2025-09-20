import { useState, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

const noteInputStyles = cva(
  [
    // Base styles using standardized tokens
    "w-full bg-surface-elevation border border-surface-stroke",
    "text-sm text-text-primary placeholder:text-text-muted",
    "transition-all duration-normal resize-none",
    "focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
    "focus:ring-offset-surface-bg focus:border-brand",
    "disabled:opacity-60 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "h-16 p-md rounded-lg text-sm",
        md: "h-20 p-lg rounded-xl text-sm",
        lg: "h-24 p-xl rounded-xl text-base",
      },
      variant: {
        default: "bg-surface-elevation",
        filled: "bg-surface-card",
        outlined: "bg-transparent border-2",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export type NoteInputProps = VariantProps<typeof noteInputStyles> & {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  autoFocus?: boolean;
  className?: string;
  submitLabel?: string;
  layout?: "horizontal" | "vertical";
};

export const NoteInput = forwardRef<HTMLTextAreaElement, NoteInputProps>(
  ({
    onSubmit,
    placeholder = "Anote a tratativa...",
    disabled = false,
    maxLength = 500,
    showCharCount = true,
    autoFocus = false,
    className,
    submitLabel = "Salvar",
    layout = "horizontal",
    size,
    variant,
  }, ref) => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSubmit(trimmed);
      setValue("");
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSubmit();
      }
    };

    const isSubmitDisabled = !value.trim() || disabled;
    const charactersUsed = value.length;
    const charactersRemaining = maxLength - charactersUsed;
    const isNearLimit = charactersRemaining <= 50;

    const containerClass = layout === "vertical"
      ? "flex flex-col gap-3"
      : "flex items-start gap-3";

    const textareaClass = layout === "vertical" ? "w-full" : "flex-1";

    return (
      <div className={containerClass}>
        <div className={cn("relative", textareaClass)}>
          <textarea
            ref={ref}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoFocus={autoFocus}
            className={cn(noteInputStyles({ size, variant }), className)}
            aria-label={placeholder}
            rows={size === "sm" ? 3 : size === "lg" ? 5 : 4}
          />

          {showCharCount && (
            <div className={cn(
              "absolute bottom-2 right-2 text-xs transition-colors",
              isNearLimit ? "text-feedback-warning" : "text-text-muted",
              isFocused && "opacity-100",
              !isFocused && "opacity-0"
            )}>
              {charactersUsed}/{maxLength}
            </div>
          )}
        </div>

        <div className={cn(
          "flex items-center gap-2",
          layout === "vertical" && "justify-end"
        )}>
          {layout === "vertical" && showCharCount && !isFocused && (
            <span className={cn(
              "text-xs",
              isNearLimit ? "text-feedback-warning" : "text-text-muted"
            )}>
              {charactersUsed}/{maxLength}
            </span>
          )}

          <Button
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"}
          >
            {submitLabel}
          </Button>

          {value.trim() && (
            <Button
              variant="ghost"
              size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"}
              onClick={() => setValue("")}
              disabled={disabled}
            >
              Limpar
            </Button>
          )}
        </div>

        {maxLength && isNearLimit && (
          <p className="text-xs text-feedback-warning">
            {charactersRemaining > 0
              ? `${charactersRemaining} caracteres restantes`
              : "Limite de caracteres atingido"
            }
          </p>
        )}
      </div>
    );
  }
);

NoteInput.displayName = "NoteInput";
