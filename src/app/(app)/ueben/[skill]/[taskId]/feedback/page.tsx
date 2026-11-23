"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { FeedbackView } from "@/components/practice/feedback-view";
import { Button } from "@/components/ui/button";
import { getTask } from "@/content";
import { useAppState } from "@/lib/storage";
import type { Feedback } from "@/lib/types";

function FeedbackBody() {
  const params = useParams<{ skill: string; taskId: string }>();
  const search = useSearchParams();
  const { attempts, replaceFeedback } = useAppState();
  const task = getTask(params.taskId);
  const requested = useRef("");
  const attemptId = search.get("attempt");
  const attempt =
    attempts.find((item) => item.id === attemptId) ??
    attempts.find((item) => item.result.taskId === params.taskId && item.mode === "practice");

  useEffect(() => {
    if (!task || !attempt) return;
    if (attempt.result.feedback.source !== "mock") return;
    if (!task.writing && !task.speaking) return;
    if (requested.current === attempt.id) return;
    requested.current = attempt.id;
    void fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.id,
        text: attempt.result.text,
        notes: attempt.result.notes,
        checklist: attempt.result.checklist,
        durationSec: attempt.result.durationSec,
      }),
    })
      .then((response) => response.json())
      .then((feedback: Feedback) => {
        if (feedback && typeof feedback.percent === "number") replaceFeedback(attempt.id, feedback);
      })
      .catch(() => undefined);
  }, [attempt, task, replaceFeedback]);

  if (!task || task.skill !== params.skill) {
    return <p className="text-muted">Diese Aufgabe gibt es nicht.</p>;
  }
  if (!attempt) {
    return (
      <div>
        <p className="text-muted">Noch keine Abgabe für diese Aufgabe.</p>
        <Button href={`/ueben/${task.skill}/${task.id}`} className="mt-4">
          Aufgabe öffnen
        </Button>
      </div>
    );
  }

  return (
    <FeedbackView
      task={task}
      result={attempt.result}
      audioScope="uebung"
      eyebrow="Auswertung der Übung"
      backHref="/uebersicht"
      retryHref={`/ueben/${task.skill}/${task.id}`}
    />
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<p className="text-muted">Auswertung wird geladen …</p>}>
      <FeedbackBody />
    </Suspense>
  );
}
