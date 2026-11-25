"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { audioManifest } from "@/content/exams/manifest-data";
import { audioKey, saveAudio } from "@/lib/audio-memory";
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

export function SprechenTeil({
  teil,
  draft,
  topicId,
  audioScope,
  onDraft,
  onTopic,
  autoPlay,
}: {
  teil: Teil;
  draft: SpeakingDraft;
  topicId?: string;
  audioScope: string;
  onDraft: (draft: SpeakingDraft) => void;
  onTopic?: (topicId: string) => void;
  autoPlay?: boolean;
}) {
  const task = teil.speaking;
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const started = useRef<number | null>(null);
  const chunks = useRef<Blob[]>([]);
  const played = useRef(false);

  useEffect(() => {
    return () => {
      recorder.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!autoPlay || played.current || !task?.examinerAudio) return;
    played.current = true;
    const src = audioManifest.clips[task.examinerAudio.id]?.src;
    if (!src) return;
    void new Audio(src).play().catch(() => undefined);
  }, [autoPlay, task]);

  if (!task) return null;

  const examinerSrc = task.examinerAudio ? audioManifest.clips[task.examinerAudio.id]?.src : undefined;
  const followKey = topicId && task.followupAudio?.[topicId] ? topicId : "default";
  const follow = task.followupAudio?.[followKey] ?? task.followupAudio?.default;
  const followSrc = follow ? audioManifest.clips[follow.id]?.src : undefined;

  async function toggleRecording() {
    if (recording && recorder.current) {
      recorder.current.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const media = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunks.current = [];
      media.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      media.onstop = () => {
        const blob = new Blob(chunks.current, { type: media.mimeType || "audio/webm" });
        saveAudio(audioKey(audioScope, teil.id), blob);
        const durationSec = started.current ? Math.max(1, Math.round((Date.now() - started.current) / 1000)) : draft.durationSec;
        onDraft({ ...draft, durationSec });
        stream.getTracks().forEach((track) => track.stop());
      };
      started.current = Date.now();
      media.start();
      recorder.current = media;
      setRecording(true);
      setError("");
    } catch {
      setError("Das Mikrofon ist nicht freigegeben. Sie können die Stichpunkte trotzdem markieren.");
    }
  }

  function togglePoint(point: string) {
    const checklist = draft.checklist.includes(point) ? draft.checklist.filter((item) => item !== point) : [...draft.checklist, point];
    onDraft({ ...draft, checklist });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-micro font-semibold text-muted">Beispieldaten · Teil {teil.number} · etwa {task.minutes} Min.</p>
        <h2 className="mt-1 text-h3 font-semibold">{teil.title}</h2>
        <p className="mt-2 text-small text-muted">{teil.instruction}</p>
      </div>
      <Card className="p-4">
        <p>{task.situation}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-small">
          {task.prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
        {task.topics ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.topics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => onTopic?.(topic.id)}
                className={cn(
                  "rounded-full border px-3 py-2 text-small font-semibold",
                  topicId === topic.id ? "border-brand bg-brand-soft text-brand-text" : "border-border",
                )}
              >
                {topic.title}
              </button>
            ))}
          </div>
        ) : null}
        {task.partnerLines?.map((line) => (
          <p key={line.text} className="mt-3 text-small text-muted">
            <span className="font-semibold text-foreground">{line.name}: </span>
            {line.text}
          </p>
        ))}
        <div className="mt-4 flex flex-wrap gap-2">
          {examinerSrc ? <audio controls src={examinerSrc} preload="none" className="w-full" /> : null}
          {followSrc ? <audio controls src={followSrc} preload="none" className="w-full" /> : null}
        </div>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void toggleRecording()} variant={recording ? "danger" : "primary"}>
          {recording ? "Aufnahme stoppen" : "Aufnahme starten"}
        </Button>
        {draft.durationSec > 0 ? <Badge>{draft.durationSec} Sekunden</Badge> : null}
      </div>
      {error ? <p className="text-small text-danger">{error}</p> : null}
      <Card className="space-y-2 p-4">
        <p className="text-small font-semibold">Stichpunkte für die Einschätzung</p>
        {task.checklist.map((point) => (
          <label key={point} className="flex items-start gap-2 text-small">
            <input type="checkbox" className="mt-1" checked={draft.checklist.includes(point)} onChange={() => togglePoint(point)} />
            {point}
          </label>
        ))}
        <Textarea
          className="mt-2 min-h-24"
          value={draft.notes}
          onChange={(event) => onDraft({ ...draft, notes: event.target.value })}
          placeholder="Kurz notieren, was Sie gesagt haben."
          aria-label="Notizen"
        />
      </Card>
    </div>
  );
}
