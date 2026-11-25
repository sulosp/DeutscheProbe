import { goetheA1Mock } from "@/content/exams/goethe-a1/mock-1";
import { goetheA2Mock } from "@/content/exams/goethe-a2/mock-1";
import { goetheB1Mock } from "@/content/exams/goethe-b1/mock-1";
import { goetheB2Mock } from "@/content/exams/goethe-b2/mock-1";
import { telcA1Mock } from "@/content/exams/telc-a1/mock-1";
import { telcA2Mock } from "@/content/exams/telc-a2/mock-1";
import { telcB1Mock } from "@/content/exams/telc-b1/mock-1";
import { telcB2Mock } from "@/content/exams/telc-b2/mock-1";
import type { ExamModule, MockExam, Teil } from "@/lib/exam-model";

export const mocks: MockExam[] = [goetheA1Mock, goetheA2Mock, goetheB1Mock, goetheB2Mock, telcA1Mock, telcA2Mock, telcB1Mock, telcB2Mock];

export function getMock(id: string) {
  return mocks.find((exam) => exam.id === id) ?? null;
}

export function getMockForTrack(trackId: string) {
  return mocks.find((exam) => exam.trackId === trackId) ?? null;
}

export function findTeil(teilId: string): { exam: MockExam; module: ExamModule; teil: Teil } | null {
  for (const exam of mocks) {
    for (const part of exam.modules) {
      const teil = part.teile.find((entry) => entry.id === teilId);
      if (teil) return { exam, module: part, teil };
    }
  }
  return null;
}

export { goetheA1Mock, goetheA2Mock, goetheB1Mock, goetheB2Mock, telcA1Mock, telcA2Mock, telcB1Mock, telcB2Mock };
