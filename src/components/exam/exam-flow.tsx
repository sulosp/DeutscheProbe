"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { TaskPlayer, type PlayerHandle } from "@/components/practice/task-player";
import { FeedbackView } from "@/components/practice/feedback-view";
import { SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { getTask } from "@/content";
import { emptyDraft, useExamSession } from "@/lib/exam-session";
import { useAppState } from "@/lib/storage";
import { useCountdown } from "@/lib/use-countdown";
import { useIsClient } from "@/lib/use-is-client";
import type { PauseKind, TaskResult, Track } from "@/lib/types";

function pauseCopy(kind: PauseKind) {
  if (kind === "module") return "Zwischen diesen Modulen ist in der Prüfung mindestens 15 Minuten Pause. Hier kannst du sofort weiterüben.";
  if (kind === "oral") return "Als Nächstes kommt das mündliche Modul. Eine vorgesehene Vorbereitungszeit startet im nächsten Schritt.";
  return "An dieser Stelle gibt es in der Prüfung keine Pause. Die nächste Aufgabe folgt direkt.";
}

export function ExamStart({ track }: { track: Track }) {
  const router = useRouter();
  const { start } = useExamSession();
  const work = track.parts.reduce((sum, part) => sum + part.minutes, 0);
  const prep = track.parts.reduce((sum, part) => sum + part.prepMinutes, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-small font-semibold text-brand-text">Probeprüfung · {track.title}</p>
        <h1 className="mt-2 text-h1 font-extrabold tracking-tight">Komplette Probeprüfung</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Die Teile laufen in der öffentlichen Reihenfolge. Unterwegs gibt es kein Feedback. Die Auswertung kommt erst am Ende. Inhalte sind Beispieldaten.
        </p>
      </div>
      <Card className="divide-y divide-border">
        {track.parts.map((part, index) => (
          <div key={part.taskId} className="flex flex-wrap items-center gap-3 p-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-small font-bold text-brand-text">{index + 1}</span>
            <SkillBadge skill={part.skill} />
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{part.label}</div>
              <div className="text-small text-muted">{part.detail}</div>
            </div>
            <div className="text-small font-semibold tabular-nums">
              {part.minutes} Min.
              {part.prepMinutes > 0 ? ` + ${part.prepMinutes} Min. Vorbereitung` : ""}
            </div>
          </div>
        ))}
      </Card>
      <p className="text-small text-muted">
        Arbeitszeit etwa {work} Minuten{prep > 0 ? `, dazu ${prep} Minuten Vorbereitung` : ""}. Du kannst jeden Teil vorzeitig abgeben.
      </p>
      <Button
        onClick={() => {
          const first = track.parts[0];
          const phase = first.prepMinutes > 0 ? "prep" : "run";
          const minutes = phase === "prep" ? first.prepMinutes : first.minutes;
          start(track.id, phase, Date.now() + minutes * 60 * 1000);
          router.push("/probe/teil/0");
        }}
      >
        Prüfung starten
      </Button>
    </div>
  );
}

export function ExamPart({ track, index }: { track: Track; index: number }) {
  const router = useRouter();
  const ready = useIsClient();
  const { session, patch, saveDraft } = useExamSession();
  const part = track.parts[index];
  const task = part ? getTask(part.taskId) : null;
  const seconds = useCountdown(session && session.index === index ? session.endsAt : null);
  const playerRef = useRef<PlayerHandle | null>(null);
  const submitted = useRef(false);

  useEffect(() => {
    submitted.current = false;
  }, [index]);

  useEffect(() => {
    if (!ready) return;
    if (!session || session.trackId !== track.id) {
      router.replace("/probe");
      return;
    }
    if (session.status === "review") {
      router.replace("/probe/ergebnis");
      return;
    }
    if (session.phase === "transition") {
      router.replace(`/probe/uebergang/${session.index}`);
      return;
    }
    if (session.index !== index) {
      router.replace(`/probe/teil/${session.index}`);
    }
  }, [ready, session, track.id, index, router]);

  useEffect(() => {
    if (!session || !part || session.index !== index || session.phase === "transition" || session.endsAt) return;
    const phase = part.prepMinutes > 0 ? "prep" : "run";
    patch((current) => ({
      ...current,
      phase,
      endsAt: Date.now() + (phase === "prep" ? part.prepMinutes : part.minutes) * 60 * 1000,
    }));
  }, [session, part, index, patch]);

  useEffect(() => {
    if (seconds !== 0 || !session || !part || session.index !== index) return;
    if (session.phase === "prep") {
      patch((current) =>
        current.phase === "prep"
          ? { ...current, phase: "run", endsAt: Date.now() + part.minutes * 60 * 1000 }
          : current,
      );
      return;
    }
    playerRef.current?.submit();
  }, [seconds, session, part, index, patch]);

  if (!ready || !session || !part || !task || session.index !== index || session.phase === "transition") {
    return <p className="text-muted">Teil wird geladen …</p>;
  }

  const draft = session.drafts[String(index)] ?? emptyDraft();

  function finish(result: TaskResult) {
    if (submitted.current) return;
    submitted.current = true;
    const last = index + 1 >= track.parts.length;
    patch((current) => ({
      ...current,
      results: { ...current.results, [String(index)]: result },
      index: last ? index : index + 1,
      phase: "transition",
      endsAt: null,
      status: last ? "review" : "active",
    }));
    router.push(last ? "/probe/ergebnis" : `/probe/uebergang/${index + 1}`);
  }

  return (
    <TaskPlayer
      task={task}
      mode="exam"
      draft={draft}
      onDraft={(next) => saveDraft(index, next)}
      onSubmit={finish}
      secondsLeft={seconds}
      clockLabel={session.phase === "prep" ? "Vorbereitung" : "Prüfung"}
      phase={session.phase === "prep" ? "prep" : "run"}
      onSkipPrep={() =>
        patch((current) => ({ ...current, phase: "run", endsAt: Date.now() + part.minutes * 60 * 1000 }))
      }
      audioScope={session.id}
      handleRef={playerRef}
    />
  );
}

export function ExamTransition({ track, index }: { track: Track; index: number }) {
  const router = useRouter();
  const ready = useIsClient();
  const { session, patch } = useExamSession();
  const part = track.parts[index];
  const previous = track.parts[index - 1];

  useEffect(() => {
    if (!ready) return;
    if (!session || session.trackId !== track.id || session.status !== "active") {
      router.replace(session?.status === "review" ? "/probe/ergebnis" : "/probe");
      return;
    }
    if (session.phase !== "transition" || session.index !== index) {
      router.replace(session.phase === "transition" ? `/probe/uebergang/${session.index}` : `/probe/teil/${session.index}`);
    }
  }, [ready, session, track.id, index, router]);

  if (!part) return null;

  return (
    <div className="mx-auto max-w-xl space-y-5 py-8 text-center">
      <p className="text-small font-semibold text-brand-text">Übergang</p>
      <h1 className="text-h1 font-extrabold">Nächster Teil: {part.label}</h1>
      <div className="flex justify-center">
        <SkillBadge skill={part.skill} />
      </div>
      <p className="text-muted">{part.detail}</p>
      <p className="text-small text-muted">{previous ? pauseCopy(previous.pauseAfter) : ""}</p>
      {part.prepMinutes > 0 ? <p className="text-small">Vorbereitung: {part.prepMinutes} Minuten, danach {part.minutes} Minuten Sprechen.</p> : null}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => {
            const phase = part.prepMinutes > 0 ? "prep" : "run";
            const minutes = phase === "prep" ? part.prepMinutes : part.minutes;
            patch((current) => ({
              ...current,
              index,
              phase,
              endsAt: Date.now() + minutes * 60 * 1000,
            }));
            router.push(`/probe/teil/${index}`);
          }}
        >
          Weiter
        </Button>
        <Button href="/uebersicht" variant="secondary">
          Unterbrechen
        </Button>
      </div>
    </div>
  );
}

export function ExamResults({ track }: { track: Track }) {
  const ready = useIsClient();
  const router = useRouter();
  const { session, patch } = useExamSession();
  const { addAttempt, profile } = useAppState();

  useEffect(() => {
    if (!ready) return;
    if (!session || session.trackId !== track.id || session.status !== "review") {
      router.replace("/probe");
    }
  }, [ready, session, track.id, router]);

  useEffect(() => {
    if (!session || session.status !== "review" || session.persisted || !profile) return;
    Object.values(session.results).forEach((result) => {
      addAttempt({
        id: `${session.id}:${result.taskId}`,
        trackId: track.id,
        mode: "exam",
        createdAt: new Date().toISOString(),
        result,
      });
    });
    patch((current) => ({ ...current, persisted: true }));
  }, [session, profile, addAttempt, patch, track.id]);

  if (!session || session.status !== "review") return <p className="text-muted">Ergebnis wird geladen …</p>;

  const parts = track.parts.map((part, index) => ({ part, result: session.results[String(index)] }));
  const scored = parts.filter((item) => item.result);
  const percent = scored.length
    ? Math.round(scored.reduce((sum, item) => sum + (item.result?.feedback.percent ?? 0), 0) / scored.length)
    : 0;
  const weakest = [...scored].sort((a, b) => (a.result?.feedback.percent ?? 0) - (b.result?.feedback.percent ?? 0))[0];

  return (
    <div className="space-y-6">
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <ScoreRing percent={percent} label="Gesamt" />
        <div>
          <p className="text-small font-semibold text-brand-text">Ergebnis der Probeprüfung</p>
          <h1 className="mt-1 text-h1 font-extrabold">{track.title}</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Orientierung: viele dieser Prüfungen gelten ab etwa 60 Prozent als bestanden. Das hier ist keine offizielle Bewertung.
          </p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {parts.map(({ part, result }) => (
          <Card key={part.taskId} className="flex items-center justify-between gap-3 p-4">
            <div>
              <SkillBadge skill={part.skill} />
              <h2 className="mt-2 font-semibold">{part.label}</h2>
              <p className="text-small text-muted">{result ? `${result.feedback.percent} Prozent` : "Kein Ergebnis"}</p>
            </div>
            {result ? (
              <Button href={`/probe/auswertung/${part.skill}`} variant="secondary" size="sm">
                Auswertung
              </Button>
            ) : null}
          </Card>
        ))}
      </div>
      {weakest?.result ? (
        <Card className="p-4">
          <h2 className="font-semibold">Empfehlung für die nächsten Tage</h2>
          <p className="mt-2 text-small text-muted">
            {weakest.part.label} war der schwächste Teil. Übe die Aufgabe noch einmal in Ruhe, mit Auswertung.
          </p>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button href="/uebersicht">Zur Übersicht</Button>
        <Button href="/probe" variant="secondary">
          Neue Probeprüfung
        </Button>
      </div>
    </div>
  );
}

export function ExamAuswertung({ track, skill }: { track: Track; skill: string }) {
  const { session } = useExamSession();
  const partIndex = track.parts.findIndex((part) => part.skill === skill);
  const part = track.parts[partIndex];
  const task = part ? getTask(part.taskId) : null;
  const result = session?.results[String(partIndex)];
  if (!task || !result || !session) {
    return (
      <Card className="p-5">
        <h1 className="text-h3 font-bold">Noch keine Auswertung</h1>
        <p className="mt-2 text-muted">Schließe zuerst die Probeprüfung ab.</p>
        <Button href="/probe" className="mt-4">
          Zur Probeprüfung
        </Button>
      </Card>
    );
  }
  return (
    <FeedbackView
      task={task}
      result={result}
      audioScope={session.id}
      eyebrow="Auswertung nach der Prüfung"
      backHref="/probe/ergebnis"
      retryHref={`/ueben/${task.skill}/${task.id}`}
    />
  );
}
