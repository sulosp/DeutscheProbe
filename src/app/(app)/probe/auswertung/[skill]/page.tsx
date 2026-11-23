"use client";

import { useParams } from "next/navigation";
import { ExamAuswertung } from "@/components/exam/exam-flow";
import { findTrack, getTrack } from "@/content";
import { useExamSession } from "@/lib/exam-session";
import { useAppState } from "@/lib/storage";

export default function AuswertungPage() {
  const params = useParams<{ skill: string }>();
  const { profile } = useAppState();
  const { session } = useExamSession();
  if (!profile) return null;
  const track = getTrack(session?.trackId ?? "") ?? findTrack(profile.exam, profile.level);
  return <ExamAuswertung track={track} skill={params.skill} />;
}
