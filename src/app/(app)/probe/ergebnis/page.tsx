"use client";

import { ExamResults } from "@/components/exam/exam-flow";
import { findTrack, getTrack } from "@/content";
import { useExamSession } from "@/lib/exam-session";
import { useAppState } from "@/lib/storage";

export default function ResultPage() {
  const { profile } = useAppState();
  const { session } = useExamSession();
  if (!profile) return null;
  const track = getTrack(session?.trackId ?? "") ?? findTrack(profile.exam, profile.level);
  return <ExamResults track={track} />;
}
