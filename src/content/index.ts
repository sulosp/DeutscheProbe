import { goetheTasks } from "@/content/goethe";
import { telcTasks } from "@/content/telc";
import { findTrack, getTrack, tracks } from "@/content/tracks";
import type { ExamId, Level, Skill, Task } from "@/lib/types";

export const tasks: Task[] = [...goetheTasks, ...telcTasks];

export function getTask(id: string) {
  return tasks.find((task) => task.id === id) ?? null;
}

export function tasksFor(exam: ExamId, level: Level, skill?: Skill) {
  return tasks.filter((task) => task.exam === exam && task.level === level && (!skill || task.skill === skill));
}

export { findTrack, getTrack, tracks };

const missing = tracks.flatMap((track) =>
  track.parts
    .map((part) => part.taskId)
    .concat(track.quickTaskIds, track.recommendedTaskId, track.sampleResults.map((result) => result.taskId))
    .filter((id) => !tasks.some((task) => task.id === id))
    .map((id) => `${track.id}:${id}`),
);

if (missing.length > 0) {
  throw new Error(`Fehlende Aufgaben: ${missing.join(", ")}`);
}
