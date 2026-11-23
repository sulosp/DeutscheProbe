"use client";

import { useMemo, useSyncExternalStore } from "react";
import { uid } from "@/lib/format";
import type { Draft, ExamSessionShape } from "@/lib/exam-types";

const KEY = "deutscheprobe.exam";

const listeners = new Set<() => void>();
let cache = "";

function parse(raw: string): ExamSessionShape | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ExamSessionShape;
    if (!data?.id || !data.trackId) return null;
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

function commit(session: ExamSessionShape | null) {
  if (!session) {
    cache = "";
    window.sessionStorage.removeItem(KEY);
  } else {
    cache = JSON.stringify(session);
    window.sessionStorage.setItem(KEY, cache);
  }
  listeners.forEach((listener) => listener());
}

function update(change: (session: ExamSessionShape | null) => ExamSessionShape | null) {
  commit(change(parse(getSnapshot())));
}

export function useExamSession() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = useMemo(() => parse(raw), [raw]);

  return {
    session,
    start(trackId: string, phase: ExamSessionShape["phase"], endsAt: number | null) {
      const next: ExamSessionShape = {
        id: uid("probe"),
        trackId,
        startedAt: new Date().toISOString(),
        status: "active",
        index: 0,
        phase,
        endsAt,
        drafts: {},
        results: {},
        persisted: false,
      };
      commit(next);
      return next;
    },
    patch(change: (session: ExamSessionShape) => ExamSessionShape) {
      update((session) => (session ? change(session) : session));
    },
    saveDraft(index: number, draft: Draft) {
      update((session) => {
        if (!session) return session;
        return { ...session, drafts: { ...session.drafts, [String(index)]: draft } };
      });
    },
    clear() {
      commit(null);
    },
  };
}

export function emptyDraft(): Draft {
  return { answers: {}, text: "", notes: "", checklist: [] };
}
