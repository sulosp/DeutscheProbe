import { cn } from "@/lib/cn";
import type { Skill } from "@/lib/types";

type IconProps = { className?: string };

function base(className?: string) {
  return cn("h-4 w-4", className);
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M5 12.5 9.5 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMic({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeadphones({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 13a8 8 0 0 1 16 0" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="7" rx="1.5" />
      <rect x="17" y="13" width="4" height="7" rx="1.5" />
    </svg>
  );
}

export function IconBook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 4.5h9.5A3.5 3.5 0 0 1 18 8v11.5H8.5A3.5 3.5 0 0 0 5 16.5z" />
      <path d="M5 16.5A3.5 3.5 0 0 1 8.5 13H18" />
    </svg>
  );
}

export function IconPen({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 20h4l10-10-4-4L4 16z" strokeLinejoin="round" />
      <path d="m13 7 4 4" />
    </svg>
  );
}

export function IconBlocks({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="8" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function IconFlame({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="currentColor" aria-hidden>
      <path d="M12 2s2 3 2 5.2c0-2.2 2.2-3.4 2.2-3.4S19 7 19 11.2C19 15.8 15.8 19 12 19S5 15.8 5 11.2C5 8 7.2 6.2 7.2 6.2S9 8 9.4 10C9.6 7 12 2 12 2z" />
    </svg>
  );
}

export function IconArrow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M16 3.5A8.5 8.5 0 1 0 20.5 14 7 7 0 0 1 16 3.5z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSystem({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function SkillIcon({ skill, className }: { skill: Skill; className?: string }) {
  if (skill === "sprechen") return <IconMic className={className} />;
  if (skill === "hoeren") return <IconHeadphones className={className} />;
  if (skill === "lesen") return <IconBook className={className} />;
  if (skill === "schreiben") return <IconPen className={className} />;
  return <IconBlocks className={className} />;
}
