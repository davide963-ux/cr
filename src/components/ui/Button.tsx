import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_8px_24px_-12px_rgb(103_227_174/0.55)] hover:bg-[#82ecbf]",
  secondary:
    "border border-line-strong bg-panel/70 text-paper hover:border-mint/45 hover:bg-panel-raised",
  ghost: "text-mist hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
