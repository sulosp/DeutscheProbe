"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EXAMINER_NAME, EXAMINER_ROLE, PARTNER_ROLE, hasPartner, oralScript, partnerName, scriptedOral } from "@/lib/oral-script";
import { speakGerman, stopSpeaking } from "@/lib/speak-de";
import { audioKey, saveAudio } from "@/lib/audio-memory";
import type { SpeakingDraft } from "@/lib/full-exam-session";
import type { Teil } from "@/lib/exam-model";
import { cn } from "@/lib/cn";

type Phase = "speak" | "user" | "done";

export function OralRoom({
  teil,
  draft,
  onDraft,
  secondsLeft,
  audioScope,
}: {
  teil: Teil;
  draft: SpeakingDraft;
  onDraft: (draft: SpeakingDraft) => void;
  secondsLeft: number | null;
  audioScope: string;
}) {
  const cues = oralScript(teil);
  const engine = scriptedOral(cues);
  const partner = hasPartner(teil);
  const [phase, setPhase] = useState<Phase>("speak");
  const [speaker, setSpeaker] = useState<"examiner" | "partner" | null>("examiner");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const step = useRef(0);
  const run = useRef(0);
  const reply = useRef<(() => void) | null>(null);
  const timeSaid = useRef(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const started = useRef<number | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    const id = ++run.current;
    let cancelled = false;
    step.current = 0;
    timeSaid.current = false;

    async function play() {
      while (!cancelled && run.current === id) {
        const cue = engine.lineAt(step.current);
        if (!cue) {
          setPhase("done");
          setSpeaker(null);
          return;
        }
        setPhase("speak");
        setSpeaker(cue.role);
        await speakGerman(cue.text, cue.role);
        if (cancelled || run.current !== id) return;
        step.current += 1;
        if (cue.reply) {
          setPhase("user");
          setSpeaker(null);
          await new Promise<void>((resolve) => {
            reply.current = resolve;
          });
          reply.current = null;
        }
      }
    }

    void play();
    return () => {
      cancelled = true;
      stopSpeaking();
      reply.current?.();
      recorder.current?.stream.getTracks().forEach((track) => track.stop());
    };
    // One dialogue per Teil.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teil.id]);

  useEffect(() => {
    if (phase !== "user" || timeSaid.current || secondsLeft === null) return;
    if (secondsLeft > 60 || secondsLeft <= 0) return;
    timeSaid.current = true;
    void speakGerman("Sie haben noch eine Minute.", "examiner");
  }, [phase, secondsLeft]);

  async function toggleRecording() {
    if (phase !== "user") return;
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
        onDraft({ ...draft, durationSec: draft.durationSec + durationSec });
        stream.getTracks().forEach((track) => track.stop());
        reply.current?.();
      };
      started.current = Date.now();
      media.start();
      recorder.current = media;
      setRecording(true);
      setError("");
    } catch {
      setError("Das Mikrofon ist nicht freigegeben.");
    }
  }

  const turn =
    phase === "done"
      ? "Dieser Teil ist gesprochen."
      : phase === "user"
        ? recording
          ? "Sie sprechen. Die anderen hören zu."
          : "Sie sind dran."
        : speaker === "partner"
          ? `${partnerName(teil)} spricht.`
          : "Prüferin spricht.";

  return (
    <div className="space-y-4">
      <div className={cn("grid gap-3", partner ? "sm:grid-cols-2" : "grid-cols-1")}>
        <PersonCard
          name={EXAMINER_NAME}
          role={EXAMINER_ROLE}
          tone="examiner"
          active={phase === "speak" && speaker === "examiner"}
          listening={phase === "user" && recording}
        />
        {partner ? (
          <PersonCard
            name={partnerName(teil)}
            role={PARTNER_ROLE}
            tone="partner"
            active={phase === "speak" && speaker === "partner"}
            listening={phase === "user" && recording}
          />
        ) : null}
      </div>
      <p className="rounded-xl bg-brand-soft px-3 py-2 text-small font-semibold text-brand-text" aria-live="polite">
        {turn}
      </p>
      {phase === "user" ? (
        <Button onClick={() => void toggleRecording()} variant={recording ? "danger" : "primary"}>
          {recording ? "Aufnahme stoppen" : "Aufnahme starten"}
        </Button>
      ) : null}
      {draft.durationSec > 0 ? <p className="text-micro text-muted">Aufnahme bisher {draft.durationSec} Sekunden.</p> : null}
      {error ? <p className="text-small text-danger">{error}</p> : null}
    </div>
  );
}

function PersonCard({
  name,
  role,
  tone,
  active,
  listening,
}: {
  name: string;
  role: string;
  tone: "examiner" | "partner";
  active: boolean;
  listening: boolean;
}) {
  const letter = name.split(" ").slice(-1)[0]?.slice(0, 1) ?? "?";
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border border-border bg-raised p-3", active && "ring-2 ring-brand-text")}>
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full text-small font-bold",
          tone === "examiner" ? "bg-brand-soft text-brand-text" : "bg-skill-sprechen-soft text-skill-sprechen",
          active && "animate-pulse",
        )}
        aria-hidden
      >
        {letter}
      </div>
      <div className="min-w-0">
        <div className="font-semibold">{name}</div>
        <div className="text-micro text-muted">{role}</div>
        <div className="text-micro font-semibold text-brand-text">{active ? "spricht" : listening ? "hört zu" : "wartet"}</div>
      </div>
    </div>
  );
}
