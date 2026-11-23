import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-brand text-brand-foreground hover:bg-brand-hover shadow-sm",
  secondary: "bg-raised text-foreground border border-border hover:bg-sunken",
  ghost: "bg-transparent text-foreground hover:bg-sunken",
  soft: "bg-brand-soft text-brand-text hover:opacity-90",
  danger: "bg-danger text-white hover:opacity-90",
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
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:pointer-events-none disabled:opacity-50",
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
