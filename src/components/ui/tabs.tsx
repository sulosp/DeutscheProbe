import { cn } from "@/lib/cn";

export function Tabs({
  tabs,
  value,
  onChange,
  label = "Auswahl",
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-auto rounded-full bg-sunken p-1">
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-3 text-small font-semibold tracking-tight",
              selected ? "bg-raised text-foreground shadow-sm" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
