"use client";

import Link from "next/link";
import { IconArrow, IconFlame } from "@/components/icons";
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
import { useAppState } from "@/lib/storage";
import type { ExamId, Level, Skill, Track } from "@/lib/types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function DashboardView({ track }: { track: Track }) {
  const { profile, attempts, setTrack } = useAppState();
  const { session } = useExamSession();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-h1 font-extrabold tracking-tight md:text-display">
            {track.hello}, {firstName(profile.name)}!
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Ziel: {track.title} · Prüfung in {profile.examInDays} Tagen. {track.tagline}
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
        <span className="ml-2 text-small text-muted">Niveau wechseln</span>
        {LEVELS.map((level) => (
          <Chip key={level} active={profile.level === level} onClick={() => setTrack(profile.exam, level)}>
            {level}
          </Chip>
        ))}
      </div>

      {session?.status === "active" ? (
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

      {track.layout === "goethe" ? (
        <GoetheTop track={track} recommendedTitle={recommended?.title ?? "Aufgabe"} minutes={minutes} week={week} reason={track.recommendReason} streak={streak} sample={sample} />
      ) : (
        <TelcTop track={track} />
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-h3 font-bold">Dein Fortschritt nach Prüfungsteil</h2>
          {sample ? <span className="text-micro text-soft">Beispieldaten</span> : null}
        </div>
        <div className={skills.length > 4 ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-5" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"}>
          {skills.map((skill) => {
            const stat = skillStat(track, attempts, skill, sample);
            return (
              <Card key={skill} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <SkillBadge skill={skill} />
                  <span className="text-h2 font-extrabold tabular-nums">{stat.percent}%</span>
                </div>
                <div className="mt-4">
                  <ProgressBar value={stat.percent} skill={skill} label={SKILL_LABEL[skill]} />
                </div>
                <div className="mt-3 flex justify-between text-micro text-muted">
                  <span>
                    {stat.done} von {stat.total || stat.done} Teilen geübt
                  </span>
                  <span className="font-semibold text-foreground">Ø {stat.points}/100</span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-h3 font-bold">Letzte Ergebnisse</h2>
            <Button href="/profil" variant="soft" size="sm">
              Alle ansehen
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {results.length === 0 ? <li className="py-6 text-small text-muted">Noch keine Versuche auf dieser Strecke.</li> : null}
            {results.map((result) => {
              const task = getTask(result.taskId);
              if (!task) return null;
              return (
                <li key={`${result.when}-${result.taskId}`}>
                  <Link href={`/ueben/${task.skill}/${task.id}`} className="flex items-center gap-3 py-3">
                    <span className="w-16 shrink-0 text-small text-muted">{result.when}</span>
                    <SkillBadge skill={task.skill} />
                    <span className="min-w-0 flex-1 truncate font-medium">{task.title}</span>
                    <ScorePill score={result.score} />
                    <IconArrow className="hidden text-soft sm:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
        <section>
          <h2 className="mb-3 text-h3 font-bold">Schnell üben</h2>
          <div className="space-y-3">
            {track.quickTaskIds.map((id) => {
              const task = getTask(id);
              if (!task) return null;
              return <TaskCard key={task.id} skill={task.skill} title={task.title} meta={`${task.teil} · ${task.minutes} Min.`} href={`/ueben/${task.skill}/${task.id}`} />;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function attemptsForTrack<T extends { trackId: string }>(attempts: T[], trackId: string, sample: boolean) {
  if (sample) return [];
  return attempts.filter((attempt) => attempt.trackId === trackId);
}

function GoetheTop({
  track,
  recommendedTitle,
  minutes,
  week,
  reason,
  streak,
  sample,
}: {
  track: Track;
  recommendedTitle: string;
  minutes: number;
  week: boolean[];
  reason: string;
  streak: number;
  sample: boolean;
}) {
  const recommended = getTask(track.recommendedTaskId);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
      <BrandPanel className="p-5 md:p-6">
        <p className="text-small text-white/80">Probeprüfung · {track.title.replace("Goethe-Zertifikat ", "Goethe ")}</p>
        <h2 className="mt-3 max-w-md text-h1 font-extrabold leading-tight">Komplette Probeprüfung starten</h2>
        <p className="mt-3 max-w-lg text-small text-white/85">
          Lesen, Hören, Schreiben und Sprechen in der echten Reihenfolge – mit Timer und Gesamtwertung.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {track.parts.map((part) => (
            <span key={part.taskId} className="rounded-full bg-white/15 px-3 py-1 text-micro font-semibold">
              {part.label} {part.minutes} Min.
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href="/probe" variant="secondary">
            Jetzt starten <IconArrow />
          </Button>
          <span className="text-micro text-white/80">Zwischenspeichern jederzeit möglich</span>
        </div>
      </BrandPanel>
      <div className="grid gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 font-semibold">
            <IconFlame className="text-streak" /> {streak} Tage in Folge
          </div>
          <p className="mt-1 text-micro text-muted">{sample ? "Beispiel-Serie, bis eigene Versuche dazukommen." : "Tage mit mindestens einer Übung."}</p>
          <div className="mt-3 flex gap-2">
            {DAYS.map((day, index) => (
              <span key={day} className="text-center text-micro text-muted">
                <span className={`mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full ${week[index] ? "bg-streak-fill text-white" : "bg-sunken text-soft"}`}>
                  {week[index] ? "✓" : ""}
                </span>
                {day}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-small">
            <span className="text-muted">Tagesziel</span>
            <span className="font-semibold tabular-nums">{minutes} / 30 Min.</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={(minutes / 30) * 100} tone="streak" label="Tagesziel" />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-small font-semibold text-brand-text">Nächste empfohlene Aufgabe</p>
          {recommended ? <SkillBadge skill={recommended.skill} className="mt-3" /> : null}
          <h3 className="mt-3 text-h3 font-bold">{recommendedTitle}</h3>
          <p className="mt-1 text-small text-muted">{reason}</p>
          {recommended ? (
            <Button href={`/ueben/${recommended.skill}/${recommended.id}`} variant="secondary" size="sm" className="mt-4">
              Aufgabe starten <IconArrow />
            </Button>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

function TelcTop({ track }: { track: Track }) {
  const cards = [track.recommendedTaskId, ...track.quickTaskIds]
    .map((id) => getTask(id))
    .filter((task): task is NonNullable<typeof task> => Boolean(task));
  return (
    <div className="space-y-5">
      <BrandPanel className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-small text-white/80">Probeprüfung · {track.title.replace("telc Deutsch ", "telc ")}</p>
          <h2 className="mt-1 text-h2 font-extrabold">Komplette Probeprüfung starten</h2>
          <p className="mt-2 max-w-2xl text-small text-white/85">{track.parts.map((part) => part.label).join(", ")}.</p>
        </div>
        <Button href="/probe" variant="secondary">
          Jetzt starten
        </Button>
      </BrandPanel>
      <section>
        <h2 className="mb-3 text-h3 font-bold">Empfohlene Aufgaben</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {cards.map((task) => (
            <TaskCard key={task.id} skill={task.skill} title={task.title} meta={`${task.minutes} Min.`} href={`/ueben/${task.skill}/${task.id}`} detail={task.intro} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TaskCard({
  skill,
  title,
  meta,
  href,
  detail,
}: {
  skill: Skill;
  title: string;
  meta: string;
  href: string;
  detail?: string;
}) {
  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between gap-2">
        <SkillBadge skill={skill} />
        <span className="text-micro text-muted">{meta}</span>
      </div>
      <h3 className="mt-3 font-bold leading-snug">{title}</h3>
      {detail ? <p className="mt-2 line-clamp-3 text-small text-muted">{detail}</p> : null}
      <Button href={href} variant="secondary" size="sm" className="mt-4 w-fit">
        Starten <IconArrow />
      </Button>
    </Card>
  );
}
