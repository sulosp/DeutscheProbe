"use client";

import { useEffect, useState } from "react";
import { Badge, SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ScoreRing } from "@/components/ui/score-ring";
import { audioKey, getAudio } from "@/lib/audio-memory";
import type { Task, TaskResult } from "@/lib/types";

export function FeedbackView({
  task,
  result,
  audioScope,
  backHref,
  retryHref,
  eyebrow,
}: {
  task: Task;
  result: TaskResult;
  audioScope?: string;
  backHref: string;
  retryHref: string;
  eyebrow: string;
}) {
  const feedback = result.feedback;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!audioScope) return;
    const blob = getAudio(audioKey(audioScope, task.id));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioScope, task.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <SkillBadge skill={task.skill} />
        <Badge>Beispieldaten</Badge>
        <Badge>{eyebrow}</Badge>
      </div>
      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <ScoreRing percent={feedback.percent} />
        <div>
          <h1 className="text-h1 font-semibold tracking-tight">{task.title}</h1>
          <p className="mt-2 max-w-2xl text-muted">{feedback.summary}</p>
          <p className="mt-2 text-small text-muted">
            {feedback.score} von {feedback.maxScore} Punkten
            {feedback.source === "gemini" ? " · Einschätzung mit Gemini" : feedback.source === "auto" ? " · automatisch gewertet" : " · Demo-Einschätzung"}
          </p>
        </div>
      </div>

      {feedback.items ? (
        <div className="space-y-3">
          {task.items?.map((item, index) => {
            const review = feedback.items?.find((entry) => entry.id === item.id);
            const correct = review?.correct ?? false;
            const chosen = item.options.find((option) => option.id === review?.chosen)?.label;
            const answer = item.options.find((option) => option.id === item.correct)?.label;
            return (
              <Card key={item.id} className={`p-4 ${correct ? "bg-success-soft" : "bg-danger-soft"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">
                    {index + 1}. {item.prompt}
                  </h2>
                  <Badge tone={correct ? "success" : "danger"}>{correct ? "Richtig" : "Falsch"}</Badge>
                </div>
                <p className="mt-2 text-small">Deine Antwort: {chosen || "keine"}</p>
                {correct ? null : <p className="text-small">Passend: {answer}</p>}
                <p className="mt-2 text-small text-muted">{item.explanation}</p>
              </Card>
            );
          })}
        </div>
      ) : null}

      {feedback.criteria ? (
        <div className="grid gap-3 md:grid-cols-2">
          {feedback.criteria.map((criterion) => (
            <Card key={criterion.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">{criterion.label}</h2>
                <span className="tabular-nums text-small font-semibold">
                  {criterion.points}/{criterion.max}
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={(criterion.points / Math.max(criterion.max, 1)) * 100} tone="brand" label={criterion.label} />
              </div>
              <p className="mt-3 text-small text-muted">{criterion.comment}</p>
            </Card>
          ))}
        </div>
      ) : null}

      {result.text ? (
        <Card className="p-4">
          <h2 className="font-semibold">Dein Text</h2>
          <p className="mt-2 whitespace-pre-wrap">{result.text}</p>
        </Card>
      ) : null}

      {task.speaking ? (
        <Card className="p-4">
          <h2 className="font-semibold">Aufnahme</h2>
          {audioUrl ? <audio className="mt-3 w-full" controls src={audioUrl} /> : <p className="mt-2 text-small text-muted">Die Aufnahme bleibt nur in diesem Tab. Dauer: {result.durationSec} Sekunden.</p>}
          {result.notes ? <p className="mt-3 whitespace-pre-wrap text-small">{result.notes}</p> : null}
        </Card>
      ) : null}

      {feedback.strengths && feedback.strengths.length > 0 ? (
        <Card className="p-4">
          <h2 className="font-semibold">Was schon trägt</h2>
          <ul className="mt-2 list-disc pl-5 text-small">{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </Card>
      ) : null}
      {feedback.improvements && feedback.improvements.length > 0 ? (
        <Card className="p-4">
          <h2 className="font-semibold">Als Nächstes</h2>
          <ul className="mt-2 list-disc pl-5 text-small">{feedback.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button href={backHref}>Zur Übersicht</Button>
        <Button href={retryHref} variant="secondary">
          Nochmal
        </Button>
      </div>
    </div>
  );
}
