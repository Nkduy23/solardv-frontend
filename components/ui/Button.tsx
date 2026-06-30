import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-sunrise-amber text-navy hover:bg-sunrise-copper focus-visible:outline-sunrise-amber",
  secondary:
    "bg-navy text-paper hover:bg-navy-light focus-visible:outline-navy",
  ghost:
    "bg-transparent text-current border border-current/30 hover:border-current/60",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
