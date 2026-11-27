"use client";

import { useMemo, useSyncExternalStore } from "react";
import { uid } from "@/lib/format";
import { pushAttempt, pushProfile } from "@/lib/supabase/browser";
import type { AppState, Attempt, ExamId, Level, Profile } from "@/lib/types";

const KEY = "deutscheprobe.v1";

const listeners = new Set<() => void>();
let cache = "";

function empty(): AppState {
  return { profile: null, attempts: [] };
}

function parse(raw: string): AppState {
  if (!raw) return empty();
  try {
    const data = JSON.parse(raw) as Partial<AppState>;
    return {
      profile: data.profile ?? null,
      attempts: Array.isArray(data.attempts) ? data.attempts.slice(0, 120) : [],
    };
  } catch {
    return empty();
  }
}

function read() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(KEY) ?? "";
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

function commit(state: AppState) {
  const raw = JSON.stringify(state);
  cache = raw;
  window.localStorage.setItem(KEY, raw);
  listeners.forEach((listener) => listener());
}

function update(change: (state: AppState) => AppState) {
  commit(change(parse(getSnapshot())));
}

export const demoProfile: Profile = {
  name: "Lena Klein",
  email: "lena@beispiel.de",
  exam: "goethe",
  level: "B1",
  goal: "Goethe-Zertifikat B1",
  examInDays: 38,
  onboarded: true,
  auth: "demo",
};

export function useAppState() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const state = useMemo(() => parse(raw), [raw]);

  return {
    profile: state.profile,
    attempts: state.attempts,
    startDemo() {
      update((current) => ({ ...current, profile: demoProfile }));
    },
    registerDemo(input: { name: string; email: string }) {
      const profile: Profile = {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        exam: "goethe",
        level: "B1",
        goal: "",
        examInDays: 30,
        onboarded: false,
        auth: "demo",
      };
      update((current) => ({ ...current, profile }));
    },
    signInDemo(email: string) {
      const current = parse(getSnapshot());
      if (!current.profile || current.profile.email !== email.trim().toLowerCase()) {
        return false;
      }
      return true;
    },
    completeOnboarding(input: { exam: ExamId; level: Level; goal: string; examInDays: number }) {
      update((current) => {
        if (!current.profile) return current;
        const profile = { ...current.profile, ...input, onboarded: true };
        void pushProfile(profile).catch(() => undefined);
        return { ...current, profile };
      });
    },
    setTrack(exam: ExamId, level: Level) {
      update((current) => {
        if (!current.profile) return current;
        const profile = { ...current.profile, exam, level };
        void pushProfile(profile).catch(() => undefined);
        return { ...current, profile };
      });
    },
    updateProfile(patch: Partial<Profile>) {
      update((current) => {
        if (!current.profile) return current;
        const profile = { ...current.profile, ...patch };
        void pushProfile(profile).catch(() => undefined);
        return { ...current, profile };
      });
    },
    adopt(profile: Profile) {
      update((current) => ({ ...current, profile }));
    },
    addAttempt(attempt: Attempt) {
      update((current) => {
        if (current.attempts.some((item) => item.id === attempt.id)) return current;
        void pushAttempt(attempt).catch(() => undefined);
        return { ...current, attempts: [attempt, ...current.attempts].slice(0, 120) };
      });
    },
    replaceFeedback(attemptId: string, feedback: Attempt["result"]["feedback"]) {
      update((current) => ({
        ...current,
        attempts: current.attempts.map((attempt) =>
          attempt.id === attemptId ? { ...attempt, result: { ...attempt.result, feedback } } : attempt,
        ),
      }));
    },
    signOut() {
      update((current) => ({ ...current, profile: null }));
    },
    newAttemptId() {
      return uid("versuch");
    },
  };
}
