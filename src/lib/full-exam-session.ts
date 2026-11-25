"use client";

import { useMemo, useSyncExternalStore } from "react";
import { uid } from "@/lib/format";
import type { Feedback } from "@/lib/types";

const KEY = "deutscheprobe.full-exam";

export type FullExamMode = "exam" | "training";

export type FullExamPhase = "formalities" | "module-intro" | "run" | "transfer" | "break" | "oral-prep" | "results";

export type SpeakingDraft = {
  notes: string;
  checklist: string[];
  durationSec: number;
};

export type HoerenPlayback = {
  stepIndex: number;
  pauseEndsAt: number | null;
};

export type FullExamSession = {
  id: string;
  mockId: string;
  mode: FullExamMode;
  startedAt: string;
  status: "active" | "review";
  moduleIndex: number;
  phase: FullExamPhase;
  teilIndex: number;
  endsAt: number | null;
  hoeren: HoerenPlayback | null;
  answers: Record<string, string>;
  writing: Record<string, string>;
  speaking: Record<string, SpeakingDraft>;
  prepNotes: string;
  feedback: Record<string, Feedback>;
  moduleTiming: Record<string, { startedAt: number; endedAt?: number }>;
};

const listeners = new Set<() => void>();
let cache = "";

function parse(raw: string): FullExamSession | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as FullExamSession;
    if (!data?.id || !data.mockId) return null;
    data.answers ??= {};
    data.writing ??= {};
    data.speaking ??= {};
    data.feedback ??= {};
    data.moduleTiming ??= {};
    data.prepNotes ??= "";
    return data;
  } catch {
    return null;
  }
}

function read() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(KEY) ?? "";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  const next = read();
  if (next !== cache) cache = next;
  return cache;
}

function getServerSnapshot() {
  return "";
}

function commit(session: FullExamSession | null) {
  if (!session) {
    cache = "";
    window.sessionStorage.removeItem(KEY);
  } else {
    cache = JSON.stringify(session);
    window.sessionStorage.setItem(KEY, cache);
  }
  listeners.forEach((listener) => listener());
}

function update(change: (session: FullExamSession | null) => FullExamSession | null) {
  commit(change(parse(getSnapshot())));
}

export function useFullExamSession() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = useMemo(() => parse(raw), [raw]);

  return {
    session,
    start(mockId: string, mode: FullExamMode, phase: FullExamPhase = "module-intro", endsAt: number | null = null) {
      const next: FullExamSession = {
        id: uid("probe"),
        mockId,
        mode,
        startedAt: new Date().toISOString(),
        status: "active",
        moduleIndex: 0,
        phase,
        teilIndex: 0,
        endsAt,
        hoeren: null,
        answers: {},
        writing: {},
        speaking: {},
        prepNotes: "",
        feedback: {},
        moduleTiming: {},
      };
      commit(next);
      return next;
    },
    patch(change: (session: FullExamSession) => FullExamSession) {
      update((session) => (session ? change(session) : session));
    },
    clear() {
      commit(null);
    },
  };
}

export function emptySpeaking(): SpeakingDraft {
  return { notes: "", checklist: [], durationSec: 0 };
}
