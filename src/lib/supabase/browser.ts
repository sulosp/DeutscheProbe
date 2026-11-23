"use client";

import { createBrowserClient } from "@supabase/ssr";
import { demoMode, supabaseAnonKey, supabaseUrl } from "@/lib/env";
import type { Attempt, Profile } from "@/lib/types";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (demoMode) return null;
  if (!client) client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}

export async function pullProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const { data: row } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const record = row as {
    display_name?: string;
    exam?: Profile["exam"];
    level?: Profile["level"];
    goal?: string;
    exam_in_days?: number;
    onboarded?: boolean;
  } | null;
  return {
    name: record?.display_name || (user.user_metadata?.name as string) || "Konto",
    email: user.email || "",
    exam: record?.exam === "telc" ? "telc" : "goethe",
    level: record?.level === "A1" || record?.level === "A2" || record?.level === "B2" ? record.level : "B1",
    goal: record?.goal || "",
    examInDays: record?.exam_in_days || 30,
    onboarded: Boolean(record?.onboarded),
    auth: "supabase",
  };
}

export async function pushProfile(profile: Profile) {
  const supabase = getSupabase();
  if (!supabase || profile.auth !== "supabase") return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("profiles").upsert({
    id: data.user.id,
    display_name: profile.name,
    exam: profile.exam,
    level: profile.level,
    goal: profile.goal,
    exam_in_days: profile.examInDays,
    onboarded: profile.onboarded,
  });
}

export async function pushAttempt(attempt: Attempt) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("attempts").insert({
    id: attempt.id,
    user_id: data.user.id,
    track_id: attempt.trackId,
    task_id: attempt.result.taskId,
    skill: attempt.result.skill,
    mode: attempt.mode,
    score: attempt.result.feedback.score,
    max_score: attempt.result.feedback.maxScore,
    payload: attempt.result,
  });
}
