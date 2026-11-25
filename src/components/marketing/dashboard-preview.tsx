import type { ReactNode } from "react";
import { IconArrow, IconFlame } from "@/components/icons";
import { Mark } from "@/components/logo";
import { Badge, ScorePill, SkillBadge } from "@/components/ui/badge";
import { BrandPanel, Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Skill } from "@/lib/types";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEK = [true, true, true, true, true, false, false];

const NAV = ["Übersicht", "Sprechen", "Hören", "Lesen", "Schreiben", "Profil"];

const SKILLS: Array<{ skill: Skill; percent: number; done: number; points: number }> = [
  { skill: "sprechen", percent: 58, done: 7, points: 68 },
  { skill: "hoeren", percent: 75, done: 9, points: 81 },
  { skill: "lesen", percent: 83, done: 10, points: 88 },
  { skill: "schreiben", percent: 42, done: 5, points: 64 },
];

const RESULTS: Array<{ when: string; skill: Skill; title: string; score: number }> = [
  { when: "Heute", skill: "sprechen", title: "Ein Thema präsentieren", score: 72 },
  { when: "Gestern", skill: "lesen", title: "Anzeigen zuordnen", score: 90 },
  { when: "14. Okt.", skill: "hoeren", title: "Durchsagen am Bahnhof", score: 80 },
  { when: "13. Okt.", skill: "schreiben", title: "E-Mail an deine Vermieterin", score: 61 },
];

const QUICK: Array<{ skill: Skill; title: string; meta: string }> = [
  { skill: "hoeren", title: "Durchsagen am Bahnhof", meta: "Hören · Teil 1 · 40 Min." },
  { skill: "schreiben", title: "E-Mail an deine Vermieterin", meta: "Schreiben · Aufgabe 1 · 60 Min." },
];

function FakeButton({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={
        light
          ? "inline-flex h-10 items-center gap-2 rounded-full border border-brand-text/20 bg-brand px-4 text-small font-semibold tracking-tight text-brand-foreground shadow-sm dark:border-border dark:bg-raised dark:text-foreground"
          : "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-raised px-3 text-small font-semibold tracking-tight text-foreground shadow-sm"
      }
    >
      {children}
    </span>
  );
}

export function DashboardPreview() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-raised shadow-pop">
      <div className="flex items-center gap-2 border-b border-border bg-raised px-3 py-2.5 sm:px-4">
        <Mark />
        <span className="font-display text-small font-extrabold tracking-tight text-foreground">DeutscheProbe</span>
        <div className="ml-2 hidden items-center gap-1 lg:flex" aria-hidden>
          {NAV.map((item) => (
            <span
              key={item}
              className={
                item === "Übersicht"
                  ? "rounded-full bg-brand-soft px-3 py-1.5 text-micro font-bold text-brand-text"
                  : "rounded-full px-3 py-1.5 text-micro font-semibold text-muted"
              }
            >
              {item}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-border bg-raised px-2.5 py-1 text-micro font-semibold sm:inline">Goethe · B1</span>
          <span className="hidden items-center gap-1 text-small font-bold text-streak sm:inline-flex">
            <IconFlame className="text-streak" />
            12
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-micro font-bold text-brand-text">SP</span>
        </div>
      </div>

      <div className="space-y-4 bg-surface p-3 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-h2 font-extrabold tracking-tight text-foreground md:text-h1">Guten Tag, Sulochana!</h2>
            <p className="mt-1 max-w-xl text-small text-muted">
              Ziel: Goethe-Zertifikat B1 · Prüfung in 38 Tagen. Lesen, Hören, Schreiben und Sprechen in der echten Reihenfolge.
            </p>
          </div>
          <Badge tone="warn" className="self-start">
            Alle Werte = Beispieldaten
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" aria-hidden>
          <span className="mr-1 text-micro text-muted">Prüfung</span>
          <span className="rounded-full bg-brand px-3 py-1 text-micro font-bold text-brand-foreground">Goethe</span>
          <span className="rounded-full px-3 py-1 text-micro font-semibold text-muted">telc</span>
          <span className="ml-1 text-micro text-muted">Niveau</span>
          {["A1", "A2", "B1", "B2"].map((level) => (
            <span
              key={level}
              className={
                level === "B1"
                  ? "rounded-full bg-brand px-2.5 py-1 text-micro font-bold text-brand-foreground"
                  : "rounded-full px-2.5 py-1 text-micro font-semibold text-muted"
              }
            >
              {level}
            </span>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.9fr]">
          <BrandPanel className="p-4 sm:p-5">
            <p className="text-small font-semibold text-brand-text dark:font-normal dark:text-white/80">Probeprüfung · Goethe B1</p>
            <h3 className="mt-2 max-w-md text-h3 font-extrabold leading-tight sm:text-h2">Komplette Probeprüfung starten</h3>
            <p className="mt-2 max-w-lg text-small text-muted dark:text-white/85">
              Lesen, Hören, Schreiben und Sprechen in der echten Reihenfolge – mit Timer und Gesamtwertung.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Lesen 65 Min.", "Hören 40 Min.", "Schreiben 60 Min.", "Sprechen 15 Min."].map((item) => (
                <span key={item} className="rounded-full bg-white px-2.5 py-1 text-micro font-bold text-brand-text shadow-sm dark:bg-white/15 dark:text-white dark:shadow-none">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <FakeButton light>
                Jetzt starten <IconArrow />
              </FakeButton>
              <span className="text-micro text-muted dark:text-white/80">Zwischenspeichern jederzeit möglich</span>
            </div>
          </BrandPanel>

          <div className="grid gap-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 font-bold">
                <IconFlame className="text-streak" /> 12 Tage in Folge
              </div>
              <p className="mt-1 text-micro text-muted">Beispiel-Serie, bis eigene Versuche dazukommen.</p>
              <div className="mt-3 flex gap-1.5">
                {DAYS.map((day, index) => (
                  <span key={day} className="text-center text-micro text-muted">
                    <span
                      className={`mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full ${WEEK[index] ? "bg-streak-dot text-streak-on-dot" : "bg-sunken text-soft"}`}
                    >
                      {WEEK[index] ? "✓" : ""}
                    </span>
                    {day}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-small">
                <span className="text-muted">Tagesziel</span>
                <span className="font-bold tabular-nums">20 / 30 Min.</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={(20 / 30) * 100} tone="streak" label="Tagesziel" />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-small font-bold text-brand-text">Nächste empfohlene Aufgabe</p>
              <SkillBadge skill="sprechen" className="mt-3" />
              <h3 className="mt-3 font-bold leading-snug">Gemeinsam etwas planen: Sommerfest</h3>
              <p className="mt-1 text-small text-muted">Sprechen Teil 1 · Dein schwächster Bereich laut letzter Bewertung (Interaktion).</p>
              <div className="mt-3">
                <FakeButton>
                  Aufgabe starten <IconArrow />
                </FakeButton>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-small font-bold tracking-tight">Dein Fortschritt nach Prüfungsteil</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {SKILLS.map((item) => (
              <Card key={item.skill} className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <SkillBadge skill={item.skill} />
                  <span className="font-display text-h3 font-extrabold tabular-nums">{item.percent}%</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={item.percent} skill={item.skill} label={item.skill} />
                </div>
                <div className="mt-2 flex justify-between text-micro text-muted">
                  <span>{item.done} von 12 Teilen geübt</span>
                  <span className="font-bold text-foreground">Ø {item.points}/100</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-small font-bold">Letzte Ergebnisse</h3>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-micro font-bold text-brand-text">Alle ansehen</span>
            </div>
            <ul className="divide-y divide-border">
              {RESULTS.map((result) => (
                <li key={result.title} className="flex items-center gap-2 py-2.5 sm:gap-3">
                  <span className="w-14 shrink-0 text-micro text-muted sm:w-16 sm:text-small">{result.when}</span>
                  <SkillBadge skill={result.skill} className="hidden sm:inline-flex" />
                  <span className="min-w-0 flex-1 truncate text-small font-semibold">{result.title}</span>
                  <ScorePill score={result.score} />
                </li>
              ))}
            </ul>
            <p className="mt-2 rounded-xl bg-brand-softer px-3 py-2 text-small text-muted">
              Letzte Rückmeldung, Sprechen: 72 von 100 Punkten. Das liegt im Bereich, in dem viele Prüfungen als bestanden gelten.
            </p>
          </Card>
          <div>
            <h3 className="mb-2 text-small font-bold">Schnell üben</h3>
            <div className="space-y-3">
              {QUICK.map((task) => (
                <Card key={task.title} className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <SkillBadge skill={task.skill} />
                    <span className="text-micro text-muted">{task.meta}</span>
                  </div>
                  <h4 className="mt-2 font-bold leading-snug">{task.title}</h4>
                  <div className="mt-3">
                    <FakeButton>
                      Starten <IconArrow />
                    </FakeButton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Vorschau der Übersicht für Goethe B1 mit Fertigkeiten, Serie, nächsten Aufgaben und letzter Rückmeldung. Beispieldaten.
      </figcaption>
    </figure>
  );
}
