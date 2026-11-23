"use client";

import { useEffect, useRef, useState } from "react";
import { SkillIcon } from "@/components/icons";
import { Badge, SkillBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Timer } from "@/components/ui/timer";
import { audioKey, saveAudio } from "@/lib/audio-memory";
import { wordCount } from "@/lib/format";
import { feedbackFromDraft } from "@/lib/scoring";
import type { Draft, Task, TaskResult } from "@/lib/types";

export type PlayerHandle = { submit: () => void };

export function TaskPlayer({
  task,
  mode,
  draft,
  onDraft,
  onSubmit,
  secondsLeft,
  clockLabel,
  phase = "run",
  onSkipPrep,
  audioScope,
  handleRef,
}: {
  task: Task;
  mode: "practice" | "exam";
  draft: Draft;
  onDraft: (draft: Draft) => void;
  onSubmit: (result: TaskResult) => void;
  secondsLeft: number | null;
  clockLabel?: string;
  phase?: "prep" | "run";
  onSkipPrep?: () => void;
  audioScope: string;
  handleRef?: { current: PlayerHandle | null };
}) {
  const submitted = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState("");
  const [duration, setDuration] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const started = useRef<number | null>(null);
  const chunks = useRef<Blob[]>([]);

  const submit = () => {
    if (submitted.current) return;
    submitted.current = true;
    let durationSec = duration;
    if (started.current) {
      durationSec = Math.max(durationSec, Math.round((Date.now() - started.current) / 1000));
    }
    if (recorder.current && recorder.current.state === "recording") {
      recorder.current.stop();
    }
    onSubmit({
      taskId: task.id,
      skill: task.skill,
      answers: draft.answers,
      text: draft.text,
      notes: draft.notes,
      checklist: draft.checklist,
      durationSec,
      feedback: feedbackFromDraft(task, draft, durationSec),
    });
  };

  useEffect(() => {
    if (!handleRef) return;
    handleRef.current = { submit };
    return () => {
      handleRef.current = null;
    };
  });

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recorder.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function choose(itemId: string, optionId: string) {
    onDraft({ ...draft, answers: { ...draft.answers, [itemId]: optionId } });
  }

  function playAudio() {
    if (!task.audio || !window.speechSynthesis) return;
    if (mode === "exam" && plays >= 2) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(task.audio.script);
    utterance.lang = "de-DE";
    utterance.rate = 0.96;
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("de"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => setPlaying(false);
    setPlaying(true);
    setPlays((count) => count + 1);
    window.speechSynthesis.speak(utterance);
  }

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
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      media.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks.current, { type: media.mimeType || "audio/webm" });
        saveAudio(audioKey(audioScope, task.id), blob);
        if (started.current) setDuration(Math.max(1, Math.round((Date.now() - started.current) / 1000)));
      };
      started.current = Date.now();
      media.start();
      recorder.current = media;
      setRecording(true);
      setRecordError("");
    } catch {
      setRecordError("Mikrofon nicht verfügbar. Du kannst die Aufgabe mit Stichpunkten abschließen.");
    }
  }

  const examLocked = mode === "exam" && phase === "prep";

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SkillBadge skill={task.skill} />
            <Badge>Beispieldaten</Badge>
            <Badge>{mode === "exam" ? "Probeprüfung" : "Übung"}</Badge>
          </div>
          <h1 className="mt-3 text-h1 font-semibold tracking-tight">{task.title}</h1>
          <p className="mt-1 text-small text-muted">
            {task.teil} · {task.minutes} Min.
          </p>
        </div>
        {secondsLeft !== null ? <Timer seconds={secondsLeft} label={clockLabel ?? (mode === "exam" ? "Prüfung" : "Zeit")} /> : null}
      </div>
      <p className="max-w-3xl text-muted">{task.intro}</p>
      {mode === "exam" ? (
        <p className="text-small text-muted">Während der Prüfung gibt es keine Auswertung. Die Punkte siehst du erst im Ergebnis.</p>
      ) : null}

      {task.audio ? (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">{task.audio.heading}</h2>
              <p className="text-small text-muted">Sprachausgabe im Browser, deutsch.</p>
            </div>
            <Button type="button" onClick={playAudio} disabled={playing || (mode === "exam" && plays >= 2)}>
              {playing ? "Läuft …" : plays === 0 ? "Abspielen" : "Nochmal"}
            </Button>
          </div>
          {mode === "exam" ? <p className="mt-2 text-micro text-muted">In der Prüfung zweimal. Gehört: {plays}/2</p> : null}
          {mode === "practice" ? (
            <div className="mt-3">
              <button type="button" className="text-small font-semibold text-brand-text" onClick={() => setShowScript((value) => !value)}>
                {showScript ? "Transkript verbergen" : "Ich kann gerade nicht hören"}
              </button>
              {showScript ? <p className="mt-2 whitespace-pre-wrap text-small leading-relaxed">{task.audio.script}</p> : null}
            </div>
          ) : null}
        </Card>
      ) : null}

      {task.passages?.map((passage) => (
        <Card key={passage.id} className="p-4">
          <h2 className="font-semibold">{passage.title}</h2>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{passage.body}</p>
        </Card>
      ))}

      {task.items ? (
        <div className="space-y-4">
          {task.items.map((item, index) => (
            <fieldset key={item.id} className="rounded-xl border border-border bg-raised p-4" disabled={examLocked}>
              <legend className="px-1 text-small font-semibold">
                {index + 1}. {item.prompt}
              </legend>
              <div className="mt-3 grid gap-2">
                {item.options.map((option) => {
                  const selected = draft.answers[item.id] === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 ${selected ? "border-brand bg-brand-soft" : "border-border"}`}
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={option.id}
                        checked={selected}
                        onChange={() => choose(item.id, option.id)}
                        className="mt-1"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      {task.writing ? (
        <Card className="p-4 md:p-5">
          <h2 className="font-semibold">Situation</h2>
          <p className="mt-2">{task.writing.situation}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-small">
            {task.writing.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="mt-3 text-small text-muted">Register: {task.writing.register}</p>
          <Textarea
            className="mt-4"
            value={draft.text}
            onChange={(event) => onDraft({ ...draft, text: event.target.value })}
            placeholder="Schreib hier."
            disabled={examLocked}
          />
          <p className="mt-2 text-small text-muted">
            {wordCount(draft.text)} Wörter · Ziel {task.writing.minWords}–{task.writing.maxWords}
          </p>
        </Card>
      ) : null}

      {task.speaking ? (
        <div className={`grid gap-4 ${task.speaking.partnerLines ? "lg:grid-cols-[1.3fr_0.7fr]" : ""}`}>
          <Card className="p-4 md:p-5">
            <h2 className="font-semibold">{examLocked ? "Vorbereitung" : "Sprechen"}</h2>
            <p className="mt-2">{task.speaking.situation}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              {task.speaking.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ol>
            <label className="mt-4 block text-small font-semibold" htmlFor="notes">
              Notizen
            </label>
            <Textarea id="notes" className="mt-2 min-h-28" value={draft.notes} onChange={(event) => onDraft({ ...draft, notes: event.target.value })} />
            {examLocked ? (
              <Button type="button" className="mt-4" onClick={onSkipPrep}>
                Vorbereitung beenden
              </Button>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={() => void toggleRecording()} variant={recording ? "danger" : "primary"}>
                  <SkillIcon skill="sprechen" />
                  {recording ? "Aufnahme stoppen" : "Aufnahme starten"}
                </Button>
                {duration > 0 ? <span className="text-small text-muted">Zuletzt {duration} Sekunden</span> : null}
              </div>
            )}
            {recordError ? <p className="mt-2 text-small text-danger">{recordError}</p> : null}
            {!examLocked ? (
              <ul className="mt-4 space-y-2">
                {task.speaking.checklist.map((item) => (
                  <li key={item}>
                    <label className="flex items-start gap-2 text-small">
                      <input
                        type="checkbox"
                        checked={draft.checklist.includes(item)}
                        onChange={() => {
                          const checklist = draft.checklist.includes(item)
                            ? draft.checklist.filter((entry) => entry !== item)
                            : [...draft.checklist, item];
                          onDraft({ ...draft, checklist });
                        }}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
          {task.speaking.partnerLines ? (
            <div className="space-y-3">
              {task.speaking.partnerLines.map((line) => (
                <Card key={line.text} className="p-4">
                  <p className="text-micro font-semibold text-muted">{line.name}</p>
                  <p className="mt-2">{line.text}</p>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <p className="text-small text-muted">{mode === "exam" ? "Teil abgeben, auch wenn noch etwas offen ist." : "Danach kommt die Auswertung."}</p>
          <Button type="button" onClick={submit} disabled={examLocked}>
            {mode === "exam" ? "Teil abgeben" : "Auswerten"}
          </Button>
        </div>
      </div>
    </div>
  );
}
