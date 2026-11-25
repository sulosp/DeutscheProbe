import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };

export function Chip({ active = false, className, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        "h-9 rounded-full px-3 text-small font-semibold tracking-tight transition",
        active ? "border border-brand-text/25 bg-brand text-brand-foreground shadow-sm dark:border-transparent" : "border border-transparent text-muted hover:bg-sunken hover:text-foreground",
        className,
      )}
      aria-pressed={active}
      {...props}
    />
  );
}
