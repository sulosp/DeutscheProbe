import { cn } from "@/lib/cn";
import type { Skill } from "@/lib/types";

const ringColor: Record<Skill, string> = {
  sprechen: "var(--skill-sprechen-vivid)",
  hoeren: "var(--skill-hoeren-vivid)",
  lesen: "var(--skill-lesen-vivid)",
  schreiben: "var(--skill-schreiben-vivid)",
  sprachbausteine: "var(--skill-sprachbausteine-vivid)",
};

export function WeekBars({
  labels,
  values,
  caption,
}: {
  labels: string[];
  values: number[];
  caption: string;
}) {
  return (
    <div role="img" aria-label={caption} className="flex h-40 items-end gap-2">
      {values.map((value, index) => {
        const height = Math.max(8, Math.min(100, value));
        return (
          <div key={labels[index]} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end">
              <div
                className={cn("w-full rounded-lg", height > 16 ? "border border-brand-text/25 bg-brand" : "bg-sunken")}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-micro text-muted">{labels[index]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function WeekSpark({ values }: { values: number[] }) {
  const width = 72;
  const height = 28;
  const max = Math.max(...values, 1);
  const path = values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (value / max) * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-16" aria-hidden>
      <path d={path} fill="none" stroke="var(--brand-text)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReadinessDonut({ percent, caption }: { percent: number; caption: string }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, Math.round(percent)));
  const dash = (safe / 100) * circumference;
  return (
    <svg viewBox="0 0 140 140" className="h-36 w-36" role="img" aria-label={caption}>
      <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--surface-sunken)" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="var(--brand-text)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="68" textAnchor="middle" fill="var(--text)" fontSize="26" fontWeight="700">
        {safe}%
      </text>
      <text x="70" y="88" textAnchor="middle" fill="var(--text-muted)" fontSize="11">
        bereit
      </text>
    </svg>
  );
}

export function SkillRing({ percent, skill, label }: { percent: number; skill: Skill; label: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, Math.round(percent)));
  const dash = (safe / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label={`${label} ${safe} Prozent`}>
        <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--surface-sunken)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={ringColor[skill]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="36" textAnchor="middle" fill="var(--text)" fontSize="12" fontWeight="700">
          {safe}
        </text>
      </svg>
      <span className="text-micro font-semibold">{label}</span>
    </div>
  );
}
