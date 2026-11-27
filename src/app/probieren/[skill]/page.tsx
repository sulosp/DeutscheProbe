"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { FeedbackView } from "@/components/practice/feedback-view";
import { TaskPlayer } from "@/components/practice/task-player";
import { SiteHeader } from "@/components/shell/site-header";
import { Button } from "@/components/ui/button";
import { getTask } from "@/content";
import { emptyDraft } from "@/lib/exam-session";
import { isSkill, SKILL_LABEL } from "@/lib/skills";
import type { Draft, Skill, TaskResult } from "@/lib/types";

const sampleTaskId: Record<Skill, string> = {
  lesen: "goethe-b1-lesen",
  hoeren: "goethe-b1-hoeren",
  schreiben: "goethe-b1-schreiben",
  sprechen: "goethe-b1-sprechen",
  sprachbausteine: "telc-b1-lesen",
};

export default function TryExercisePage() {
  const params = useParams<{ skill: string }>();
  const skill = isSkill(params.skill) ? params.skill : null;
  const task = skill && skill !== "sprachbausteine" ? getTask(sampleTaskId[skill]) : null;
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [result, setResult] = useState<TaskResult | null>(null);

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {!task || !skill ? (
          <div>
            <h1 className="text-h2 font-extrabold">Diese Übung gibt es nicht</h1>
            <Button href="/" className="mt-4">
              Zur Startseite
            </Button>
          </div>
        ) : result ? (
          <FeedbackView
            task={task}
            result={result}
            audioScope="probieren"
            backHref="/"
            retryHref={`/probieren/${skill}`}
            eyebrow="Ohne Konto"
          />
        ) : (
          <div className="space-y-4">
            <p className="text-small font-semibold text-brand-text">Ohne Konto · Goethe B1 · {SKILL_LABEL[skill]}</p>
            <TaskPlayer
              task={task}
              mode="practice"
              draft={draft}
              onDraft={setDraft}
              secondsLeft={null}
              audioScope="probieren"
              onSubmit={setResult}
            />
          </div>
        )}
      </main>
    </div>
  );
}
