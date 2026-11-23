import Link from "next/link";
import { IconCheck } from "@/components/icons";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-2 font-semibold tracking-tight text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand text-brand-foreground shadow-sm">
        <IconCheck className="h-4 w-4" />
      </span>
      DeutscheProbe
    </Link>
  );
}
