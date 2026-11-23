import { cn } from "@/lib/cn";
import { formatClock } from "@/lib/format";

export function Timer({
  seconds,
  label = "Zeit",
  warnUnder = 60,
}: {
  seconds: number;
  label?: string;
  warnUnder?: number;
}) {
  const warn = seconds < warnUnder;
  return (
    <div
      role="timer"
      aria-label={`${label} ${formatClock(seconds)}`}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-3 font-semibold tabular-nums",
        warn ? "border-danger bg-danger-soft text-danger" : "border-border bg-raised text-foreground",
      )}
    >
      <span className={cn("text-micro font-medium", warn ? "text-danger" : "text-muted")}>{label}</span>
      {formatClock(seconds)}
    </div>
  );
}
