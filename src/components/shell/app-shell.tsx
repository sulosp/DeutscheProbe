"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconClose, IconFlame, IconMenu } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { findTrack } from "@/content";
import { cn } from "@/lib/cn";
import { demoMode } from "@/lib/env";
import { initials } from "@/lib/format";
import { SKILL_LABEL, SKILL_ORDER } from "@/lib/skills";
import { streakCount } from "@/lib/stats";
import { useAppState } from "@/lib/storage";
import { pullProfile } from "@/lib/supabase/browser";
import { useIsClient } from "@/lib/use-is-client";

const linkClass = (active: boolean) =>
  cn(
    "rounded-full px-3 py-2 text-small font-bold tracking-tight",
    active ? "bg-brand-soft text-brand-text" : "text-muted hover:bg-sunken hover:text-foreground",
  );

export function AppShell({ children }: { children: ReactNode }) {
  const ready = useIsClient();
  const { profile, attempts, adopt } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const pulled = useRef(false);

  useEffect(() => {
    if (demoMode || !ready || pulled.current) return;
    pulled.current = true;
    void pullProfile()
      .then((remote) => {
        if (remote) adopt(remote);
      })
      .catch(() => undefined);
  }, [ready, adopt]);

  useEffect(() => {
    if (!ready) return;
    if (!profile) {
      router.replace("/anmelden");
      return;
    }
    if (!profile.onboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [ready, profile, router, pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!ready || !profile?.onboarded) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-muted">DeutscheProbe wird geladen …</div>;
  }

  const track = findTrack(profile.exam, profile.level);
  const streak = streakCount(attempts, attempts.length === 0, track.sampleStreak);
  const links = [
    { href: "/uebersicht", label: "Übersicht" },
    ...SKILL_ORDER.filter((skill) => track.skills.includes(skill)).map((skill) => ({
      href: `/ueben/${skill}`,
      label: SKILL_LABEL[skill],
    })),
    { href: "/profil", label: "Profil" },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-raised/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Logo href="/uebersicht" />
          <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/uebersicht" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href} className={linkClass(active)} aria-current={active ? "page" : undefined}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/auswahl" className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-small font-bold sm:inline-flex">
              {profile.exam === "goethe" ? "Goethe" : "telc"} · {profile.level}
            </Link>
            <span className="hidden items-center gap-1 text-small font-semibold text-streak sm:inline-flex">
              <IconFlame className="text-streak" />
              {streak}
            </span>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link
              href="/profil"
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-micro font-bold text-brand-text"
              aria-label="Profil"
            >
              {initials(profile.name)}
            </Link>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full lg:hidden" aria-label="Menü" onClick={() => setOpen((value) => !value)}>
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
        {open ? (
          <nav className="space-y-1 border-t border-border px-4 py-3 lg:hidden" aria-label="Mobilnavigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 font-semibold">
                {link.label}
              </Link>
            ))}
            <Link href="/auswahl" className="block rounded-lg px-3 py-2 font-semibold">
              Prüfung wählen
            </Link>
            <Link href="/probe" className="block rounded-lg px-3 py-2 font-semibold">
              Probeprüfung
            </Link>
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
