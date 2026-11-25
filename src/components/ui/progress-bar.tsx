import { cn } from "@/lib/cn";
import { skillBarClass } from "@/lib/skills";
import type { Skill } from "@/lib/types";

const tones = {
  brand: "bg-brand",
  success: "bg-success",
  warn: "bg-warn",
  danger: "bg-danger",
  streak: "bg-streak-fill",
};

export function ProgressBar({
  value,
  tone = "brand",
  skill,
  label,
}: {
  value: number;
  tone?: keyof typeof tones;
  skill?: Skill;
  label?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-sunken"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("h-full rounded-full", skill ? skillBarClass(skill) : tones[tone])} style={{ width: `${width}%` }} />
    </div>
  );
}
