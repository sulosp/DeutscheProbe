import Link from "next/link";
import { cn } from "@/lib/cn";

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("mark-gradient grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-white shadow-sm", className)} aria-hidden>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M6.2 4.2h6.2c3.7 0 6.1 2.4 6.1 7.8s-2.4 7.8-6.1 7.8H6.2V4.2Zm2.4 2.2v11.2h3.6c2.2 0 3.6-1.5 3.6-5.6s-1.4-5.6-3.6-5.6H8.6Z" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-2 font-display text-[1.05rem] font-extrabold tracking-tight text-foreground">
      <Mark />
      DeutscheProbe
    </Link>
  );
}
