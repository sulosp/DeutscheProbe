"use client";

import { useTheme } from "next-themes";
import { IconMoon, IconSun, IconSystem } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/use-is-client";

const options = [
  { id: "light", label: "Hell", icon: IconSun },
  { id: "dark", label: "Dunkel", icon: IconMoon },
  { id: "system", label: "System", icon: IconSystem },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const ready = useIsClient();

  return (
    <div role="group" aria-label="Darstellung" className={cn("inline-flex rounded-full bg-sunken p-0.5", className)}>
      {options.map((option) => {
        const active = ready && theme === option.id;
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.id)}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full",
              active ? "bg-raised text-foreground shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
