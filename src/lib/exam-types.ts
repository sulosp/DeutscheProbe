import type { Draft, TaskResult } from "@/lib/types";

export type ExamPhase = "prep" | "run" | "transition";

export type ExamSessionShape = {
  id: string;
  trackId: string;
  startedAt: string;
  status: "active" | "review";
  index: number;
  phase: ExamPhase;
  endsAt: number | null;
  drafts: Record<string, Draft>;
  results: Record<string, TaskResult>;
  persisted: boolean;
};

export type { Draft };
