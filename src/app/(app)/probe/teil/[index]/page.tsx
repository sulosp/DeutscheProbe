"use client";

import { useParams } from "next/navigation";
import { ExamPart } from "@/components/exam/exam-flow";
import { findTrack, getTrack } from "@/content";
import { useExamSession } from "@/lib/exam-session";
import { useAppState } from "@/lib/storage";

export default function ProbePartPage() {
  const params = useParams<{ index: string }>();
  const { profile } = useAppState();
  const { session } = useExamSession();
  if (!profile) return null;
  const index = Number(params.index);
  if (!Number.isInteger(index) || index < 0) return <p className="text-muted">Dieser Teil existiert nicht.</p>;
  const track = getTrack(session?.trackId ?? "") ?? findTrack(profile.exam, profile.level);
  return <ExamPart track={track} index={index} />;
}
