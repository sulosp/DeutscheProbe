import { goetheB1Mock } from "@/content/exams/goethe-b1/mock-1";
import type { ExamModule, MockExam, Teil } from "@/lib/exam-model";

export const mocks: MockExam[] = [goetheB1Mock];

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

export { goetheB1Mock };
