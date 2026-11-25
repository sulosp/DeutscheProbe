"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SolvedExample, TeilQuestions } from "@/components/full-exam/items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { audioManifest } from "@/content/exams/manifest-data";
import { buildHoerenTimeline } from "@/lib/hoeren-timeline";
import type { HoerenPlayback } from "@/lib/full-exam-session";
import type { ExamModule } from "@/lib/exam-model";
import { useCountdown } from "@/lib/use-countdown";
import { formatClock } from "@/lib/format";

export function HoerenPlayer({
  module,
  playback,
  mode,
  answers,
  onAnswer,
  onPlayback,
  onDone,
}: {
  module: ExamModule;
  playback: HoerenPlayback;
  mode: "exam" | "training";
  answers: Record<string, string>;
  onAnswer: (itemId: string, optionId: string) => void;
  onPlayback: (next: HoerenPlayback) => void;
  onDone: () => void;
}) {
  const timeline = useMemo(() => buildHoerenTimeline(module, audioManifest), [module]);
  const step = timeline[playback.stepIndex];
  const audioRef = useRef<HTMLAudioElement>(null);
  const advancing = useRef(false);
  const [blocked, setBlocked] = useState(false);
  const [missing, setMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewTeil, setViewTeil] = useState<number | null>(null);
  const pauseLeft = useCountdown(step?.kind === "pause" ? playback.pauseEndsAt : null);
  const strict = mode === "exam";

  function go(index: number) {
    if (index >= timeline.length) {
      onDone();
      return;
    }
    const next = timeline[index];
    onPlayback({
      stepIndex: index,
      pauseEndsAt: next?.kind === "pause" ? Date.now() + (next.seconds ?? 0) * 1000 : null,
    });
  }

  useEffect(() => {
    advancing.current = false;
    setBlocked(false);
    setMissing(false);
    setProgress(0);
    setViewTeil(null);
  }, [playback.stepIndex]);

  useEffect(() => {
    if (!step || step.kind !== "pause" || !playback.pauseEndsAt) return;
    const wait = Math.max(0, playback.pauseEndsAt - Date.now());
    const id = window.setTimeout(() => {
      if (advancing.current) return;
      advancing.current = true;
      go(playback.stepIndex + 1);
    }, wait);
    return () => window.clearTimeout(id);
    // The timeout is keyed to this pause only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.stepIndex, playback.pauseEndsAt]);

  useEffect(() => {
    if (!step || step.kind !== "audio") return;
    const audio = audioRef.current;
    if (!audio) return;
    if (!step.src) {
      setMissing(true);
      return;
    }
    audio.src = step.src;
    const onEnded = () => {
      if (advancing.current) return;
      advancing.current = true;
      go(playback.stepIndex + 1);
    };
    const onTime = () => {
      if (audio.duration && Number.isFinite(audio.duration)) setProgress(audio.currentTime / audio.duration);
    };
    const onError = () => setMissing(true);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("error", onError);
    void audio.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playback.stepIndex, step?.kind, step?.src]);

  useEffect(() => {
    const upcoming = timeline[playback.stepIndex + 1];
    if (upcoming?.kind !== "audio" || !upcoming.src) return;
    const preload = new Audio();
    preload.preload = "auto";
    preload.src = upcoming.src;
  }, [playback.stepIndex, timeline]);

  if (!step) return <p className="text-muted">Hören ist vorbereitet …</p>;

  const teil = module.teile[viewTeil ?? step.teilIndex] ?? module.teile[0];
  const highlight = viewTeil === null ? step.highlightItemIds : [];

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warn">{strict ? "Prüfungsmodus" : "Trainingsmodus"}</Badge>
          <span className="text-small font-semibold">Teil {module.teile[step.teilIndex]?.number ?? 1}</span>
          <span className="text-small text-muted">{step.label}</span>
          {step.playNumber ? <span className="text-small text-muted">{step.playNumber}. Wiedergabe</span> : null}
        </div>
        <p className="mt-3 text-small text-muted">
          {strict
            ? "Die Texte laufen von selbst. Pause und Zurückspulen sind aus. Antworten bleiben bis zum Antwortbogen änderbar."
            : "Im Training dürfen Sie pausieren und den Text noch einmal starten."}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sunken" aria-hidden>
          <div className="h-full bg-brand transition-all" style={{ width: step.kind === "pause" ? "100%" : `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-micro text-muted">
          <span>{step.kind === "pause" ? step.label : "Wiedergabe"}</span>
          {step.kind === "pause" && pauseLeft !== null ? <span className="font-semibold tabular-nums text-foreground">{formatClock(pauseLeft)}</span> : null}
        </div>
        <audio ref={audioRef} preload="auto" className="pointer-events-none absolute h-px w-px opacity-0" />
        {blocked ? (
          <Button className="mt-4" onClick={() => audioRef.current?.play().then(() => setBlocked(false)).catch(() => setBlocked(true))}>
            Start Hören
          </Button>
        ) : null}
        {missing ? (
          <div className="mt-4 space-y-3">
            <p className="text-small text-danger">Diese Audiodatei fehlt. Der Schritt kann übersprungen werden.</p>
            <Button variant="secondary" onClick={() => go(playback.stepIndex + 1)}>
              Weiter
            </Button>
          </div>
        ) : null}
        {!strict && step.kind === "audio" && !missing ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                if (audio.paused) void audio.play();
                else audio.pause();
              }}
            >
              Pause / weiter
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                audio.currentTime = 0;
                void audio.play();
              }}
            >
              Nochmal
            </Button>
            <Button variant="ghost" size="sm" onClick={() => go(playback.stepIndex + 1)}>
              Nächster Schritt
            </Button>
          </div>
        ) : null}
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {module.teile.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setViewTeil(index === step.teilIndex ? null : index)}
            className={`shrink-0 rounded-full px-3 py-1 text-small font-semibold ${
              (viewTeil ?? step.teilIndex) === index ? "bg-brand text-brand-foreground" : "bg-sunken text-muted"
            }`}
          >
            Teil {entry.number}
          </button>
        ))}
      </div>

      {teil ? (
        <div className="space-y-3">
          <p className="text-small text-muted">{teil.instruction}</p>
          <SolvedExample teil={teil} />
          <TeilQuestions teil={teil} answers={answers} onAnswer={onAnswer} highlightIds={highlight} />
        </div>
      ) : null}
    </div>
  );
}
