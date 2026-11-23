"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { TaskPlayer } from "@/components/practice/task-player";
import { Button } from "@/components/ui/button";
import { getTask } from "@/content";
import { emptyDraft } from "@/lib/exam-session";
import { trackId } from "@/lib/format";
import { useAppState } from "@/lib/storage";
import type { Draft } from "@/lib/types";

export default function TaskPage() {
  const params = useParams<{ skill: string; taskId: string }>();
  const router = useRouter();
  const { profile, addAttempt, newAttemptId } = useAppState();
  const task = getTask(params.taskId);
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  if (!profile) return null;
  if (!task || task.skill !== params.skill) {
    return (
      <div>
        <p className="text-muted">Diese Aufgabe gibt es nicht.</p>
        <Button href="/uebersicht" className="mt-4">
          Zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <TaskPlayer
      task={task}
      mode="practice"
      draft={draft}
      onDraft={setDraft}
      secondsLeft={null}
      audioScope="uebung"
      onSubmit={(result) => {
        const id = newAttemptId();
        addAttempt({
          id,
          trackId: trackId(task.exam, task.level),
          mode: "practice",
          createdAt: new Date().toISOString(),
          result,
        });
        router.push(`/ueben/${task.skill}/${task.id}/feedback?attempt=${id}`);
      }}
    />
  );
}
