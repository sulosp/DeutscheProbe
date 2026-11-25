"use client";

import { ExamStart } from "@/components/exam/exam-flow";
import { FullExamStart } from "@/components/full-exam/runner";
import { findTrack } from "@/content";
import { getMockForTrack } from "@/content/exams";
import { useAppState } from "@/lib/storage";

export default function ProbePage() {
  const { profile } = useAppState();
  if (!profile) return null;
  const track = findTrack(profile.exam, profile.level);
  const mock = getMockForTrack(track.id);
  if (mock) return <FullExamStart exam={mock} />;
  return <ExamStart track={track} />;
}
