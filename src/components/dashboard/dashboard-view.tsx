"use client";

import Link from "next/link";
import { IconArrow, IconFlame } from "@/components/icons";
import { ReadinessDonut, SkillRing, WeekBars, WeekSpark } from "@/components/dashboard/charts";
import { Badge, ScorePill, SkillBadge } from "@/components/ui/badge";
import { BrandPanel, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getTask } from "@/content";
import { firstName } from "@/lib/format";
import { SKILL_LABEL, SKILL_ORDER } from "@/lib/skills";
import { minutesToday, sampleMode, skillStat, streakCount, weekMarks } from "@/lib/stats";
import { useExamSession } from "@/lib/exam-session";
import { useFullExamSession } from "@/lib/full-exam-session";
import { useAppState } from "@/lib/storage";
import type { ExamId, Level, Track } from "@/lib/types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function DashboardView({ track }: { track: Track }) {
  const { profile, attempts, setTrack } = useAppState();
  const { session } = useExamSession();
  const { session: fullExam } = useFullExamSession();
  if (!profile) return null;

  const sample = sampleMode(attempts, track.id);
  const skills = SKILL_ORDER.filter((skill) => track.skills.includes(skill));
  const recommended = getTask(track.recommendedTaskId);
  const week = weekMarks(attemptsForTrack(attempts, track.id, sample), sample, track.sampleWeek);
  const owned = attemptsForTrack(attempts, track.id, sample);
  const minutes = Math.min(30, minutesToday(owned, sample, track.sampleMinutesToday));
  const streak = streakCount(owned, sample, track.sampleStreak);
  const results = sample
    ? track.sampleResults
    : attempts
        .filter((attempt) => attempt.trackId === track.id)
        .slice(0, 4)
        .map((attempt) => ({
          when: new Date(attempt.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
          taskId: attempt.result.taskId,
          score: attempt.result.feedback.percent,
        }));
  const stats = skills.map((skill) => ({ skill, ...skillStat(track, attempts, skill, sample) }));
  const readiness = stats.length ? Math.round(stats.reduce((sum, item) => sum + item.percent, 0) / stats.length) : 0;
  const activeDays = week.filter(Boolean).length;
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const bars = week.map((on, index) => {
    if (!on) return 10;
    if (index === todayIndex) return Math.max(28, Math.round((minutes / 30) * 100));
    return 72;
  });
  const upcoming = [track.recommendedTaskId, ...track.quickTaskIds]
    .map((id) => getTask(id))
    .filter((task, index, list): task is NonNullable<typeof task> => Boolean(task) && list.findIndex((item) => item?.id === task?.id) === index);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-small font-semibold text-brand-text">{track.title}</p>
          <h1 className="mt-1 text-h2 font-extrabold tracking-tight md:text-h1">
            {track.hello}, {firstName(profile.name)}!
          </h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Prüfung in {profile.examInDays} Tagen. {track.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sample ? <Badge tone="warn">Alle Werte = Beispieldaten</Badge> : null}
          <Button href="/auswahl" variant="secondary" size="sm">
            Übung wählen
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-small text-muted">Prüfung</span>
        {(["goethe", "telc"] as ExamId[]).map((exam) => (
          <Chip key={exam} active={profile.exam === exam} onClick={() => setTrack(exam, profile.level)}>
            {exam === "goethe" ? "Goethe" : "telc"}
          </Chip>
        ))}
        <span className="ml-2 text-small text-muted">Niveau</span>
        {LEVELS.map((level) => (
          <Chip key={level} active={profile.level === level} onClick={() => setTrack(profile.exam, level)}>
            {level}
          </Chip>
        ))}
      </div>

      {fullExam?.status === "active" ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-semibold">Probeprüfung läuft noch</div>
            <p className="text-small text-muted">Zeit und Antworten bleiben in diesem Tab gespeichert.</p>
          </div>
          <Button href="/probe/pruefung">Fortsetzen</Button>
        </Card>
      ) : null}
      {fullExam?.status === "review" ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-semibold">Ergebnis der letzten Prüfung</div>
            <p className="text-small text-muted">Die Auswertung liegt noch in diesem Tab.</p>
          </div>
          <Button href="/probe/pruefung" variant="secondary">
            Ergebnis öffnen
          </Button>
        </Card>
      ) : null}
      {session?.status === "active" && session.trackId !== "goethe-b1" ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <div className="font-semibold">Probeprüfung läuft noch</div>
            <p className="text-small text-muted">Deine Antworten bleiben in diesem Tab gespeichert.</p>
          </div>
          <Button href={session.phase === "transition" ? `/probe/uebergang/${session.index}` : `/probe/teil/${session.index}`}>
            Fortsetzen
          </Button>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Serie" value={String(streak)} unit="Tage" note={`${activeDays}/7 Tagen aktiv`} values={bars} />
        <StatCard label="Heute" value={String(minutes)} unit="Min." note="Ziel 30 Min." values={bars} />
        <StatCard label="Prüfung" value={String(profile.examInDays)} unit="Tage" note={track.level} values={bars} />
        <StatCard label="Bereitschaft" value={`${readiness}`} unit="%" note={sample ? "Beispieldaten" : "Ø der Teile"} values={stats.map((item) => item.percent)} />

        <Card className="col-span-2 p-4 md:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold">Aktivität diese Woche</h2>
              <p className="text-micro text-muted">{sample ? "Beispielwoche, bis eigene Versuche dazukommen." : "Tage mit mindestens einer Übung."}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-small font-bold text-streak">
              <IconFlame /> {streak}
            </span>
          </div>
          <WeekBars
            labels={DAYS}
            values={bars}
            caption={`Wochenaktivität. ${DAYS.map((day, index) => `${day} ${week[index] ? "geübt" : "frei"}`).join(", ")}.`}
          />
          <div className="mt-3 flex items-center justify-between text-small">
            <span className="text-muted">Tagesziel</span>
            <span className="font-semibold tabular-nums">{minutes} / 30 Min.</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={(minutes / 30) * 100} tone="streak" label="Tagesziel" />
          </div>
        </Card>

        <Card className="col-span-2 flex flex-col items-center justify-center gap-2 p-4 lg:col-span-1">
          <h2 className="self-start font-bold">Prüfungsreife</h2>
          <ReadinessDonut percent={readiness} caption={`Prüfungsreife ${readiness} Prozent, Durchschnitt der Teile.`} />
          <p className="text-center text-micro text-muted">{readiness >= 60 ? "Im Bereich vieler bestandener Prüfungen." : "Noch üben, besonders den schwächsten Teil."}</p>
        </Card>

        <BrandPanel className="col-span-2 flex flex-col justify-between p-4 lg:col-span-1">
          <div>
            <p className="text-micro font-semibold text-brand-text dark:font-normal dark:text-brand-foreground/80">
              Probeprüfung · {track.title.replace("Goethe-Zertifikat ", "Goethe ").replace("telc Deutsch ", "telc ")}
            </p>
            <h2 className="mt-2 text-h3 font-extrabold leading-tight">Probe starten</h2>
            <p className="mt-2 text-small text-muted dark:text-brand-foreground/85">
              {track.layout === "goethe" ? "Teile in der echten Reihenfolge, mit Timer." : track.parts.map((part) => part.label).join(", ") + "."}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {track.parts.map((part) => (
              <span key={part.taskId} className="rounded-full bg-raised px-2.5 py-1 text-micro font-semibold text-brand-text dark:bg-brand-foreground/15 dark:text-brand-foreground">
                {part.label} {part.minutes}m
              </span>
            ))}
          </div>
          <Button href="/probe" variant="ghost" className="exam-cta mt-4 w-fit">
            Jetzt starten <IconArrow />
          </Button>
        </BrandPanel>

        <Card className="col-span-2 p-4 md:p-5">
          <h2 className="font-bold">Fertigkeiten</h2>
          <div className={`mt-4 grid gap-3 ${skills.length > 4 ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}>
            {stats.map((item) => (
              <SkillRing key={item.skill} skill={item.skill} percent={item.percent} label={SKILL_LABEL[item.skill]} />
            ))}
          </div>
          <ul className="mt-4 space-y-3">
            {stats.map((item) => (
              <li key={item.skill}>
                <div className="mb-1 flex justify-between text-micro text-muted">
                  <span>
                    {SKILL_LABEL[item.skill]} · {item.done} von {item.total || item.done} Teilen
                  </span>
                  <span className="font-semibold text-foreground">Ø {item.points}/100</span>
                </div>
                <ProgressBar value={item.percent} skill={item.skill} label={SKILL_LABEL[item.skill]} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-2 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Als Nächstes</h2>
            <span className="text-micro text-muted">Diese Woche</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {DAYS.map((day, index) => (
              <div key={day} className="text-center">
                <div
                  className={`mx-auto grid h-8 w-8 place-items-center rounded-xl text-micro font-bold ${week[index] ? "bg-brand text-brand-foreground" : "bg-sunken text-soft"} ${index === todayIndex ? "ring-2 ring-brand-text" : ""}`}
                >
                  {week[index] ? "✓" : ""}
                </div>
                <div className="mt-1 text-micro text-muted">{day}</div>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-3">
            {upcoming.map((task) => (
              <li key={task.id} className="flex items-center gap-3">
                <SkillBadge skill={task.skill} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{task.title}</div>
                  <div className="text-micro text-muted">
                    {task.teil} · {task.minutes} Min.
                    {task.id === recommended?.id ? ` · ${track.recommendReason}` : ""}
                  </div>
                </div>
                <Button href={`/ueben/${task.skill}/${task.id}`} variant="secondary" size="sm">
                  Start
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-2 p-4 md:p-5 lg:col-span-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">Letzte Ergebnisse</h2>
            <Button href="/profil" variant="soft" size="sm">
              Alle ansehen
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-small">
              <thead>
                <tr className="border-b border-border text-micro text-muted">
                  <th className="py-2 font-semibold">Datum</th>
                  <th className="py-2 font-semibold">Teil</th>
                  <th className="py-2 font-semibold">Aufgabe</th>
                  <th className="py-2 text-right font-semibold">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-muted">
                      Noch keine Versuche auf dieser Strecke.
                    </td>
                  </tr>
                ) : null}
                {results.map((result) => {
                  const task = getTask(result.taskId);
                  if (!task) return null;
                  return (
                    <tr key={`${result.when}-${result.taskId}`} className="border-b border-border last:border-0">
                      <td className="py-3 text-muted">{result.when}</td>
                      <td className="py-3">
                        <SkillBadge skill={task.skill} />
                      </td>
                      <td className="py-3">
                        <Link href={`/ueben/${task.skill}/${task.id}`} className="font-semibold hover:text-brand-text">
                          {task.title}
                        </Link>
                      </td>
                      <td className="py-3 text-right">
                        <ScorePill score={result.score} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function attemptsForTrack<T extends { trackId: string }>(attempts: T[], trackId: string, sample: boolean) {
  if (sample) return [];
  return attempts.filter((attempt) => attempt.trackId === trackId);
}

function StatCard({
  label,
  value,
  unit,
  note,
  values,
}: {
  label: string;
  value: string;
  unit: string;
  note: string;
  values: number[];
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-micro font-semibold text-muted">{label}</p>
        <WeekSpark values={values.length ? values : [0]} />
      </div>
      <p className="mt-2 font-display text-h1 font-extrabold tabular-nums leading-none">
        {value}
        <span className="ml-1 text-small font-semibold text-muted">{unit}</span>
      </p>
      <p className="mt-2 text-micro font-semibold text-brand-text">{note}</p>
    </Card>
  );
}
