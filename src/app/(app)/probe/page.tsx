"use client";

import { ExamStart } from "@/components/exam/exam-flow";
import { findTrack } from "@/content";
import { useAppState } from "@/lib/storage";

export default function ProbePage() {
  const { profile } = useAppState();
  if (!profile) return null;
  return <ExamStart track={findTrack(profile.exam, profile.level)} />;
}
