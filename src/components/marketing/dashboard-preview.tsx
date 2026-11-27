import { IconBell, IconBook, IconClipboard, IconGrid, IconHeadphones, IconMic, IconPen, IconSearch } from "@/components/icons";
import { ReadinessDonut, SkillRing, WeekBars } from "@/components/dashboard/charts";
import { Mark } from "@/components/logo";
import { Badge, ScorePill, SkillBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Skill } from "@/lib/types";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEK = [true, true, true, true, true, false, false];
const BARS = [72, 72, 67, 72, 72, 10, 10];

const NAV = [
  { label: "Übersicht", icon: IconGrid, active: true },
  { label: "Sprechen", icon: IconMic, active: false },
  { label: "Hören", icon: IconHeadphones, active: false },
  { label: "Lesen", icon: IconBook, active: false },
  { label: "Schreiben", icon: IconPen, active: false },
  { label: "Prüfungen", icon: IconClipboard, active: false },
];

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
];

export function DashboardPreview() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-pop">
      <div className="flex min-h-[28rem]">
        <div className="hidden w-44 shrink-0 flex-col border-r border-border bg-raised p-3 sm:flex" aria-hidden>
          <div className="flex items-center gap-2 px-1 py-2">
            <Mark />
            <span className="font-display text-micro font-extrabold">DeutscheProbe</span>
          </div>
          <div className="mt-2 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={
                    item.active
                      ? "flex items-center gap-2 rounded-xl bg-brand-soft px-2 py-1.5 text-micro font-bold text-brand-text"
                      : "flex items-center gap-2 rounded-xl px-2 py-1.5 text-micro font-semibold text-muted"
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="hidden h-8 flex-1 items-center gap-2 rounded-full border border-border bg-raised px-3 text-micro text-soft sm:flex">
              <IconSearch className="h-3.5 w-3.5" />
              Aufgaben suchen
            </div>
            <span className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-border bg-raised text-muted">
              <IconBell className="h-3.5 w-3.5" />
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-micro font-bold text-brand-text">LK</span>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-micro font-semibold text-brand-text">Goethe-Zertifikat B1</p>
              <h2 className="font-display text-h3 font-extrabold tracking-tight">Guten Tag, Lena!</h2>
            </div>
            <Badge tone="warn">Alle Werte = Beispieldaten</Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <MiniStat label="Serie" value="12" unit="Tage" note="5/7 Tage aktiv" />
            <MiniStat label="Heute" value="20" unit="Min." note="Ziel 30 Min." />
            <MiniStat label="Prüfung" value="38" unit="Tage" note="B1" />
            <MiniStat label="Bereitschaft" value="65" unit="%" note="Ø der Teile" />

            <Card className="col-span-2 p-3">
              <h3 className="text-small font-bold">Aktivität diese Woche</h3>
              <div className="mt-2">
                <WeekBars labels={DAYS} values={BARS} caption="Beispielwoche Montag bis Freitag geübt, Wochenende frei." />
              </div>
            </Card>
            <Card className="col-span-2 flex flex-col items-center p-3 lg:col-span-1">
              <h3 className="self-start text-small font-bold">Prüfungsreife</h3>
              <ReadinessDonut percent={65} caption="Prüfungsreife 65 Prozent für Goethe B1." />
            </Card>
            <Card className="col-span-2 p-3 lg:col-span-1">
              <p className="text-micro font-semibold text-brand-text">Probeprüfung · Goethe B1</p>
              <h3 className="mt-1 font-extrabold">Probe starten</h3>
              <p className="mt-1 text-micro text-muted">Lesen, Hören, Schreiben, Sprechen.</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {["Lesen 65m", "Hören 40m", "Schreiben 60m"].map((item) => (
                  <span key={item} className="rounded-full bg-brand-soft px-2 py-0.5 text-micro font-semibold text-brand-text">
                    {item}
                  </span>
                ))}
              </div>
              <span className="mt-3 inline-flex h-8 items-center rounded-full border border-brand-text/20 bg-brand px-3 text-micro font-semibold text-brand-foreground">
                Jetzt starten
              </span>
            </Card>

            <Card className="col-span-2 p-3">
              <h3 className="text-small font-bold">Fertigkeiten</h3>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {SKILLS.map((item) => (
                  <SkillRing key={item.skill} skill={item.skill} percent={item.percent} label={item.skill === "hoeren" ? "Hören" : item.skill === "sprechen" ? "Sprechen" : item.skill === "lesen" ? "Lesen" : "Schreiben"} />
                ))}
              </div>
            </Card>
            <Card className="col-span-2 p-3">
              <h3 className="text-small font-bold">Als Nächstes</h3>
              <div className="mt-2 grid grid-cols-7 gap-1" aria-hidden>
                {DAYS.map((day, index) => (
                  <div key={day} className="text-center">
                    <div className={`mx-auto grid h-6 w-6 place-items-center rounded-lg text-[10px] font-bold ${WEEK[index] ? "bg-brand text-brand-foreground" : "bg-sunken text-soft"}`}>
                      {WEEK[index] ? "✓" : ""}
                    </div>
                    <div className="mt-1 text-[10px] text-muted">{day}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <SkillBadge skill="sprechen" />
                <span className="min-w-0 flex-1 truncate text-small font-semibold">Sommerfest planen</span>
                <span className="text-micro text-muted">15 Min.</span>
              </div>
            </Card>

            <Card className="col-span-2 p-3">
              <h3 className="text-small font-bold">Letzte Ergebnisse</h3>
              <ul className="mt-2 divide-y divide-border">
                {RESULTS.map((result) => (
                  <li key={result.title} className="flex items-center gap-2 py-2">
                    <span className="w-14 shrink-0 text-micro text-muted">{result.when}</span>
                    <SkillBadge skill={result.skill} className="hidden sm:inline-flex" />
                    <span className="min-w-0 flex-1 truncate text-small font-semibold">{result.title}</span>
                    <ScorePill score={result.score} />
                  </li>
                ))}
              </ul>
              <p className="mt-2 rounded-xl bg-brand-softer px-3 py-2 text-micro text-muted">
                Rückmeldung, Sprechen: 72 von 100. Klare Gliederung, bei der Interaktion noch Beispiele ergänzen.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        Vorschau der Übersicht für Goethe B1 mit Seitenleiste, Wochenaktivität, Prüfungsreife, Fertigkeiten und letzten Ergebnissen.
      </figcaption>
    </figure>
  );
}

function MiniStat({ label, value, unit, note }: { label: string; value: string; unit: string; note: string }) {
  return (
    <Card className="p-3">
      <p className="text-micro font-semibold text-muted">{label}</p>
      <p className="mt-1 font-display text-h3 font-extrabold tabular-nums leading-none">
        {value}
        <span className="ml-1 text-micro font-semibold text-muted">{unit}</span>
      </p>
      <p className="mt-1 text-micro font-semibold text-brand-text">{note}</p>
    </Card>
  );
}
