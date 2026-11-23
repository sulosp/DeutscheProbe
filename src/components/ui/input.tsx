import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const field =
  "w-full rounded-lg border border-border bg-raised px-3 text-foreground outline-none placeholder:text-soft focus-visible:ring-2 focus-visible:ring-brand";

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-small font-semibold text-foreground">
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, "min-h-40 py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(field, "h-11", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-small text-danger">{children}</p>;
}
