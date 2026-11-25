"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  IconBell,
  IconBlocks,
  IconBook,
  IconClipboard,
  IconClose,
  IconGrid,
  IconHeadphones,
  IconMenu,
  IconMic,
  IconPen,
  IconSearch,
  IconUser,
} from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { tasksFor, findTrack, getTask } from "@/content";
import { cn } from "@/lib/cn";
import { demoMode } from "@/lib/env";
import { initials } from "@/lib/format";
import { SKILL_LABEL } from "@/lib/skills";
import { sampleMode, streakCount } from "@/lib/stats";
import { useAppState } from "@/lib/storage";
import { pullProfile } from "@/lib/supabase/browser";
import { useIsClient } from "@/lib/use-is-client";
import type { Attempt, ExamId, Level, Skill } from "@/lib/types";

const skillNav: Array<{ skill: Skill; icon: typeof IconMic }> = [
  { skill: "sprechen", icon: IconMic },
  { skill: "hoeren", icon: IconHeadphones },
  { skill: "lesen", icon: IconBook },
  { skill: "schreiben", icon: IconPen },
  { skill: "sprachbausteine", icon: IconBlocks },
];

function isActive(pathname: string, href: string) {
  if (href === "/uebersicht") return pathname === "/uebersicht";
  if (href === "/probe") return pathname.startsWith("/probe");
  if (href === "/profil") return pathname === "/profil";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
    { href: "/uebersicht", label: "Übersicht", icon: IconGrid },
    ...skillNav
      .filter((item) => track.skills.includes(item.skill))
      .map((item) => ({ href: `/ueben/${item.skill}`, label: SKILL_LABEL[item.skill], icon: item.icon })),
    { href: "/probe", label: "Prüfungen", icon: IconClipboard },
    { href: "/profil", label: "Profil", icon: IconUser },
  ];

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-raised lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo href="/uebersicht" />
        </div>
        <SideNav links={links} pathname={pathname} />
        <div className="mt-auto space-y-3 border-t border-border p-4">
          <Link href="/auswahl" className="flex items-center justify-between rounded-xl bg-brand-soft px-3 py-2 text-small font-bold text-brand-text">
            <span>{profile.exam === "goethe" ? "Goethe" : "telc"} · {profile.level}</span>
            <span className="text-micro font-semibold">{streak} Tage</span>
          </Link>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-overlay" aria-label="Menü schließen" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-raised shadow-pop" aria-label="Hauptnavigation">
            <div className="flex h-16 items-center justify-between px-4">
              <Logo href="/uebersicht" />
              <button type="button" className="grid h-9 w-9 place-items-center rounded-full" aria-label="Menü schließen" onClick={() => setOpen(false)}>
                <IconClose />
              </button>
            </div>
            <SideNav links={links} pathname={pathname} />
            <div className="mt-auto space-y-3 border-t border-border p-4">
              <Link href="/auswahl" className="block rounded-xl bg-brand-soft px-3 py-2 text-small font-bold text-brand-text">
                {profile.exam === "goethe" ? "Goethe" : "telc"} · {profile.level}
              </Link>
              <ThemeToggle />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-raised/90 backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 px-3 md:gap-3 md:px-6">
            <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full lg:hidden" aria-label="Menü" onClick={() => setOpen(true)}>
              <IconMenu />
            </button>
            <TaskSearch exam={profile.exam} level={profile.level} />
            <div className="ml-auto flex items-center gap-2">
              <NoticeBell trackId={track.id} sampleResults={track.sampleResults} attempts={attempts} />
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Link
                href="/profil"
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-micro font-bold text-brand-text"
                aria-label="Profil"
              >
                {initials(profile.name)}
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-3 py-5 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}

function SideNav({
  links,
  pathname,
}: {
  links: Array<{ href: string; label: string; icon: typeof IconGrid }>;
  pathname: string;
}) {
  return (
    <nav className="flex-1 space-y-1 overflow-auto px-3 py-2" aria-label="Hauptnavigation">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-small font-semibold",
              active ? "bg-brand-soft text-brand-text" : "text-muted hover:bg-sunken hover:text-foreground",
            )}
          >
            <Icon />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function TaskSearch({ exam, level }: { exam: ExamId; level: Level }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const catalog = tasksFor(exam, level);
  const needle = query.trim().toLowerCase();
  const matches = (needle ? catalog.filter((task) => `${task.title} ${task.teil} ${SKILL_LABEL[task.skill]}`.toLowerCase().includes(needle)) : catalog).slice(0, 6);

  return (
    <div className="relative min-w-0 flex-1 md:max-w-md">
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-soft" />
      <input
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label="Aufgaben suchen"
        placeholder="Aufgaben suchen"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-small outline-none placeholder:text-soft focus-visible:border-brand-text"
      />
      {open ? (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-2xl border border-border bg-raised p-1 shadow-pop">
          {matches.length === 0 ? <li className="px-3 py-2 text-small text-muted">Keine Aufgabe dazu.</li> : null}
          {matches.map((task) => (
            <li key={task.id} role="option" aria-selected="false">
              <Link
                href={`/ueben/${task.skill}/${task.id}`}
                onMouseDown={(event) => event.preventDefault()}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-small hover:bg-sunken"
              >
                <span className="min-w-0 truncate font-semibold">{task.title}</span>
                <span className="shrink-0 text-micro text-muted">{SKILL_LABEL[task.skill]}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function NoticeBell({
  trackId,
  sampleResults,
  attempts,
}: {
  trackId: string;
  sampleResults: Array<{ when: string; taskId: string; score: number }>;
  attempts: Attempt[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const sample = sampleMode(attempts, trackId);
  const items = sample
    ? sampleResults.slice(0, 3)
    : attempts
        .filter((attempt) => attempt.trackId === trackId)
        .slice(0, 3)
        .map((attempt) => ({
          when: new Date(attempt.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
          taskId: attempt.result.taskId,
          score: attempt.result.feedback.percent,
        }));

  return (
    <div className="relative">
      <button
        type="button"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Rückmeldungen"
        onClick={() => setOpen((value) => !value)}
      >
        <IconBell />
        {items.length > 0 ? <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-vivid" /> : null}
      </button>
      {open ? (
        <div id={panelId} className="absolute right-0 top-11 z-20 w-72 rounded-2xl border border-border bg-raised p-3 shadow-pop">
          <p className="px-1 text-micro font-bold text-muted">{sample ? "Beispiel-Rückmeldungen" : "Letzte Rückmeldungen"}</p>
          <ul className="mt-2 space-y-1">
            {items.length === 0 ? <li className="px-1 py-2 text-small text-muted">Noch keine Rückmeldung.</li> : null}
            {items.map((item) => {
              const task = getTask(item.taskId);
              if (!task) return null;
              return (
                <li key={`${item.when}-${item.taskId}`}>
                  <Link href={`/ueben/${task.skill}/${task.id}`} className="block rounded-xl px-2 py-2 hover:bg-sunken" onClick={() => setOpen(false)}>
                    <span className="block truncate text-small font-semibold">{task.title}</span>
                    <span className="text-micro text-muted">
                      {item.when} · {item.score}/100
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
