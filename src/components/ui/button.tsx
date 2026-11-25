import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "border border-brand-text/20 bg-brand text-brand-foreground shadow-sm hover:bg-brand-hover dark:border-transparent",
  secondary: "border border-border bg-raised text-foreground shadow-sm hover:bg-sunken",
  ghost: "bg-transparent text-foreground hover:bg-sunken",
  soft: "bg-brand-soft text-brand-text hover:opacity-90",
  danger: "bg-danger-soft text-danger hover:opacity-90 dark:bg-danger-fill dark:text-white",
};

const sizes = {
  sm: "h-9 px-3 text-small",
  md: "h-11 px-4 text-small",
  lg: "h-12 px-5 text-body",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function Button({ href, variant = "primary", size = "md", className, children, type = "button", ...props }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={props.onClick as undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  );
}
