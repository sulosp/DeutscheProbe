import { getTask } from "@/content";
import { localDay } from "@/lib/format";
import type { Attempt, Skill, Track } from "@/lib/types";

export function attemptsFor(attempts: Attempt[], trackId: string) {
  return attempts.filter((attempt) => attempt.trackId === trackId);
}

export function sampleMode(attempts: Attempt[], trackId: string) {
  return attemptsFor(attempts, trackId).length === 0;
}

export function skillStat(track: Track, attempts: Attempt[], skill: Skill, sample: boolean) {
  if (sample) {
    return track.sampleProgress[skill] ?? { percent: 0, done: 0, total: 0, points: 0 };
  }
  const relevant = attemptsFor(attempts, track.id).filter((attempt) => attempt.result.skill === skill);
  if (relevant.length === 0) return { percent: 0, done: 0, total: 0, points: 0 };
  const percent = Math.round(relevant.reduce((sum, attempt) => sum + attempt.result.feedback.percent, 0) / relevant.length);
  return { percent, done: relevant.length, total: relevant.length, points: percent };
}

export function streakCount(attempts: Attempt[], sample: boolean, sampleStreak: number) {
  if (sample) return sampleStreak;
  const days = new Set(attempts.map((attempt) => localDay(new Date(attempt.createdAt))));
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(localDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(localDay(cursor))) return 0;
  }
  let count = 0;
  while (days.has(localDay(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function weekMarks(attempts: Attempt[], sample: boolean, sampleWeek: boolean[]) {
  if (sample) return sampleWeek;
  const days = new Set(attempts.map((attempt) => localDay(new Date(attempt.createdAt))));
  const today = new Date();
  const mondayOffset = today.getDay() === 0 ? -6 : 1 - today.getDay();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() + mondayOffset + index);
    return days.has(localDay(day));
  });
}

export function minutesToday(attempts: Attempt[], sample: boolean, sampleMinutes: number) {
  if (sample) return sampleMinutes;
  const today = localDay();
  return attempts
    .filter((attempt) => localDay(new Date(attempt.createdAt)) === today)
    .reduce((sum, attempt) => sum + (getTask(attempt.result.taskId)?.minutes ?? 0), 0);
}
