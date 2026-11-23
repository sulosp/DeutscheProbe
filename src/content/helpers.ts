import type { ObjectiveItem } from "@/lib/types";

export function q(
  id: string,
  prompt: string,
  correct: string,
  explanation: string,
  options: Array<[string, string]>,
): ObjectiveItem {
  return {
    id,
    prompt,
    correct,
    explanation,
    options: options.map(([optionId, label]) => ({ id: optionId, label })),
  };
}
