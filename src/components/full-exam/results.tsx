"use client";

import { useEffect, useRef } from "react";
import { Badge, SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { TeilQuestions } from "@/components/full-exam/items";
import { findTeil } from "@/content/exams";
import { formatClock } from "@/lib/format";
import type { FullExamSession } from "@/lib/full-exam-session";
import type { MockExam } from "@/lib/exam-model";
import { assessPronunciation, assessSpeakingTask, assessWritingTask, scoreMockExam, weakestTeil } from "@/lib/scoring-rules";
import type { Feedback } from "@/lib/types";

export function ExamResults({
  exam,
  session,
  onFeedback,
}: {
  exam: MockExam;
  session: FullExamSession;
  onFeedback: (feedback: Record<string, Feedback>) => void;
}) {
  const requested = useRef(new Set<string>());
  const feedback = session.feedback;
  const secondsByModule = Object.fromEntries(
    Object.entries(session.moduleTiming).map(([id, timing]) => [id, timing.endedAt ? Math.round((timing.endedAt - timing.startedAt) / 1000) : 0]),
  );
  const score = scoreMockExam(exam, {
    answers: session.answers,
    writing: session.writing,
    speaking: session.speaking,
    feedback,
    secondsByModule,
  });
  const weak = weakestTeil(score);
  const weakTeil = weak ? findTeil(weak.teilId) : null;
  const average = Math.round(score.modules.reduce((sum, entry) => sum + entry.points, 0) / Math.max(score.modules.length, 1));

  useEffect(() => {
    const next = { ...feedback };
    let changed = false;
    for (const part of exam.modules) {
      for (const teil of part.teile) {
        if (next[teil.id]) continue;
        if (teil.writing) {
          next[teil.id] = assessWritingTask(teil.writing, session.writing[teil.id] ?? "");
          changed = true;
        } else if (teil.speaking) {
          const draft = session.speaking[teil.id] ?? { notes: "", checklist: [], durationSec: 0 };
          next[teil.id] = assessSpeakingTask(teil.speaking, draft);
          changed = true;
        }
      }
      const pronunciation = part.moduleRubric?.find((criterion) => criterion.id === "aussprache");
      if (pronunciation && !next.aussprache) {
        const duration = Object.values(session.speaking).reduce((sum, draft) => sum + draft.durationSec, 0);
        next.aussprache = assessPronunciation(pronunciation.max, duration);
        changed = true;
      }
    }
    if (changed) onFeedback(next);
  }, [exam, feedback, onFeedback, session.speaking, session.writing]);

  useEffect(() => {
    for (const part of exam.modules) {
      for (const teil of part.teile) {
        if (!teil.writing && !teil.speaking) continue;
        if (requested.current.has(teil.id)) continue;
        requested.current.add(teil.id);
        const draft = session.speaking[teil.id];
        void fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mockId: exam.id,
            teilId: teil.id,
            text: session.writing[teil.id] ?? "",
            notes: draft?.notes ?? "",
            checklist: draft?.checklist ?? [],
            durationSec: draft?.durationSec ?? 0,
          }),
        })
          .then((response) => (response.ok ? response.json() : null))
          .then((result: Feedback | null) => {
            if (!result || result.source !== "gemini") return;
            onFeedback({ ...session.feedback, [teil.id]: result });
          })
          .catch(() => undefined);
      }
    }
  }, [exam, onFeedback, session.feedback, session.speaking, session.writing]);

  return (
    <div className="space-y-6">
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <ScoreRing percent={average} label="Schnitt" />
        <div>
          <p className="text-small font-semibold text-brand-text">Ergebnis · Beispieldaten</p>
          <h1 className="mt-1 text-h1 font-semibold">{exam.title}</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Jedes Modul gilt ab 60 von 100 Punkten als bestanden. Lesen und Hören rechnen 30 Rohpunkte auf 100 um. Das ist eine Übung, keine offizielle Bewertung.
          </p>
          <div className="mt-3">
            <Badge tone={score.passed ? "success" : "danger"}>{score.passed ? "Alle Module bestanden" : "Noch nicht alle Module bestanden"}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {score.modules.map((module) => (
          <Card key={module.moduleId} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <SkillBadge skill={module.skill} />
              <Badge tone={module.passed ? "success" : "danger"}>{module.passed ? "bestanden" : "nicht bestanden"}</Badge>
            </div>
            <h2 className="mt-3 text-h3 font-semibold">
              {module.points} / {module.maxPoints}
            </h2>
            <p className="text-small text-muted">
              Rohpunkte {module.raw} / {module.maxRaw}
              {module.seconds > 0 ? ` · Zeit ${formatClock(module.seconds)}` : ""}
            </p>
            <ul className="mt-3 space-y-1 text-small">
              {module.teile.map((teil) => (
                <li key={teil.teilId} className="flex justify-between gap-3">
                  <span>{teil.title}</span>
                  <span className="tabular-nums">
                    {teil.raw} / {teil.maxRaw}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {weak && weakTeil ? (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="font-semibold">Schwächster Teil</h2>
            <p className="text-small text-muted">
              {weakTeil.module.title} Teil {weak.number}: {weak.title}. Üben Sie ihn ohne Zeitdruck, mit Lösung.
            </p>
          </div>
          <Button href={`/ueben/${weakTeil.module.skill}/teil/${weak.teilId}`}>Teil üben</Button>
        </Card>
      ) : null}

      {exam.modules
        .filter((module) => module.skill === "lesen" || module.skill === "hoeren")
        .map((module) => (
          <section key={module.id} className="space-y-4">
            <h2 className="text-h3 font-semibold">{module.title} · Aufgaben</h2>
            {module.teile.map((teil) => (
              <div key={teil.id} className="space-y-3">
                <h3 className="font-semibold">
                  Teil {teil.number} · {teil.title}
                </h3>
                <TeilQuestions teil={teil} answers={session.answers} reveal />
              </div>
            ))}
          </section>
        ))}

      {exam.modules
        .filter((module) => module.skill === "schreiben" || module.skill === "sprechen")
        .map((module) => (
          <section key={module.id} className="space-y-3">
            <h2 className="text-h3 font-semibold">{module.title} · Kriterien</h2>
            {module.teile.map((teil) => {
              const result = feedback[teil.id];
              if (!result) return null;
              return (
                <Card key={teil.id} className="p-4">
                  <h3 className="font-semibold">
                    Teil {teil.number} · {result.score} / {result.maxScore}
                  </h3>
                  <p className="mt-1 text-small text-muted">{result.summary}</p>
                  <ul className="mt-3 space-y-2">
                    {result.criteria?.map((criterion) => (
                      <li key={criterion.id} className="text-small">
                        <span className="font-semibold">
                          {criterion.label}: {criterion.points} / {criterion.max}.
                        </span>{" "}
                        {criterion.comment}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
            {feedback.aussprache && module.skill === "sprechen" ? (
              <Card className="p-4">
                <h3 className="font-semibold">
                  Aussprache · {feedback.aussprache.score} / {feedback.aussprache.maxScore}
                </h3>
                <p className="mt-1 text-small text-muted">{feedback.aussprache.summary}</p>
              </Card>
            ) : null}
          </section>
        ))}

      <div className="flex flex-wrap gap-3">
        <Button href="/uebersicht">Zur Übersicht</Button>
        <Button href="/probe" variant="secondary">
          Neue Prüfung
        </Button>
      </div>
    </div>
  );
}
