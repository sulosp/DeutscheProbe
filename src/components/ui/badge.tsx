import type { ReactNode } from "react";
import { SkillIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { SKILL_LABEL, skillBadgeClass } from "@/lib/skills";
import type { Skill } from "@/lib/types";

const badgeTones = {
  neutral: "bg-sunken text-muted",
  success: "bg-success-soft text-success dark:bg-success-fill dark:text-white",
  danger: "bg-danger-soft text-danger dark:bg-danger-fill dark:text-white",
  warn: "bg-warn-soft text-warn",
};

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-micro font-bold tracking-tight", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function SkillBadge({ skill, className }: { skill: Skill; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-bold tracking-tight", skillBadgeClass(skill), className)}>
      <SkillIcon skill={skill} className="h-3.5 w-3.5" />
      {SKILL_LABEL[skill]}
    </span>
  );
}

export function ScorePill({ score, max = 100 }: { score: number; max?: number }) {
  const percent = max === 100 ? score : Math.round((score / Math.max(max, 1)) * 100);
  const tone = percent >= 80 ? "bg-success-soft text-success" : percent >= 60 ? "bg-warn-soft text-warn" : "bg-danger-soft text-danger";
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-micro font-bold tabular-nums", tone)}>{score}/{max}</span>;
}
