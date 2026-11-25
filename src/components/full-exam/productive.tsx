"use client";

import { Stimuli } from "@/components/full-exam/items";
import { OralRoom } from "@/components/full-exam/oral-room";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { wordCount } from "@/lib/format";
import type { SpeakingDraft } from "@/lib/full-exam-session";
import type { Teil } from "@/lib/exam-model";
import { cn } from "@/lib/cn";

export function SchreibenTeil({
  teil,
  text,
  onText,
}: {
  teil: Teil;
  text: string;
  onText: (value: string) => void;
}) {
  const task = teil.writing;
  if (!task) return null;
  const count = wordCount(text);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold text-muted">
          Beispieldaten · Teil {teil.number} · etwa {teil.suggestedMinutes} Min. · Ziel {task.targetWords} Wörter
        </p>
        <h2 className="mt-1 text-h3 font-semibold">{teil.title}</h2>
        <p className="mt-2 text-small text-muted">{teil.instruction}</p>
      </div>
      <Card className="p-4">
        <p>{task.situation}</p>
        {task.quote ? <p className="mt-3 border-l-2 border-brand pl-3 text-small text-muted">{task.quote}</p> : null}
        <ul className="mt-3 list-disc space-y-1 pl-5 text-small">
          {task.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="mt-3 text-micro text-muted">Register: {task.register}</p>
      </Card>
      <div>
        <Textarea value={text} onChange={(event) => onText(event.target.value)} aria-label={teil.title} placeholder="Hier schreiben …" />
        <p className={cn("mt-2 text-small tabular-nums", count < task.minWords ? "text-warn" : "text-muted")}>
          {count} Wörter · Ziel etwa {task.minWords}–{task.maxWords}
        </p>
      </div>
    </div>
  );
}

export function SpeakingSheet({ teil, topicId, onTopic }: { teil: Teil; topicId?: string; onTopic?: (topicId: string) => void }) {
  const task = teil.speaking;
  if (!task) return null;
  return (
    <Card className="p-4">
      <p className="text-micro font-semibold text-muted">Teil {teil.number} · etwa {task.minutes} Min.</p>
      <h2 className="mt-1 text-h3 font-semibold">{teil.title}</h2>
      <p className="mt-2 text-small text-muted">{teil.instruction}</p>
      {teil.stimuli.length > 0 ? (
        <div className="mt-3">
          <Stimuli teil={teil} />
        </div>
      ) : null}
      <p className="mt-3">{task.situation}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-small">
        {task.prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      {task.topics ? (
        <div className="mt-4 space-y-3">
          {task.topics.map((topic) => (
            <div key={topic.id}>
              {onTopic ? (
                <button
                  type="button"
                  onClick={() => onTopic(topic.id)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-small font-semibold",
                    topicId === topic.id ? "border-brand-text bg-brand-soft text-brand-text" : "border-border",
                  )}
                >
                  {topic.title}
                </button>
              ) : (
                <p className="text-small font-semibold">{topic.title}</p>
              )}
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-muted">
                {topic.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

export function SprechenTeil({
  teil,
  draft,
  topicId,
  audioScope,
  onDraft,
  onTopic,
  secondsLeft,
}: {
  teil: Teil;
  draft: SpeakingDraft;
  topicId?: string;
  audioScope: string;
  onDraft: (draft: SpeakingDraft) => void;
  onTopic?: (topicId: string) => void;
  secondsLeft?: number | null;
}) {
  if (!teil.speaking) return null;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <SpeakingSheet teil={teil} topicId={topicId} onTopic={onTopic} />
      <OralRoom teil={teil} draft={draft} onDraft={onDraft} secondsLeft={secondsLeft ?? null} audioScope={audioScope} />
    </div>
  );
}
