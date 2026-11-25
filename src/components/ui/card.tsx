import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-border bg-raised shadow-card", className)} {...props} />;
}

export function BrandPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("brand-panel rounded-2xl shadow-card", className)} {...props} />;
}
