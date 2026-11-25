import { JN_OPTIONS, REPEAT_CUE, RF_OPTIONS, type AudioScript, type Item, type ScriptLine, type Speaker } from "@/lib/exam-model";
import { NARRATOR } from "@/content/exams/voices";

export function narrate(id: string, lines: string[]): AudioScript {
  return {
    id,
    plays: 1,
    readSeconds: 0,
    betweenPlaysSeconds: 0,
    answerSeconds: 0,
    speakers: [NARRATOR],
    lines: lines.map((text) => ({ speaker: NARRATOR.id, text })),
  };
}

export function dialogue(
  id: string,
  speakers: Speaker[],
  lines: { who: Speaker; text: string }[],
  extra: Partial<AudioScript> = {},
): AudioScript {
  const scriptLines: ScriptLine[] = lines.map((line) => ({ speaker: line.who.id, text: line.text }));
  return {
    id,
    plays: 2,
    readSeconds: 5,
    betweenPlaysSeconds: 3,
    answerSeconds: 15,
    speakers,
    lines: scriptLines,
    ...extra,
  };
}

export function mc(id: string, number: number, prompt: string, options: { id: string; label: string }[], correct: string, explanation: string): Item {
  return { id, number, type: "mc3", prompt, options, correct, points: 1, explanation };
}

export function rf(id: string, number: number, prompt: string, correct: "richtig" | "falsch", explanation: string): Item {
  return { id, number, type: "rf", prompt, options: RF_OPTIONS, correct, points: 1, explanation };
}

export function ab(id: string, number: number, prompt: string, a: string, b: string, correct: "a" | "b", explanation: string): Item {
  return {
    id,
    number,
    type: "ab",
    prompt,
    options: [
      { id: "a", label: a },
      { id: "b", label: b },
    ],
    correct,
    points: 1,
    explanation,
  };
}

export function yn(id: string, number: number, prompt: string, correct: "ja" | "nein", explanation: string): Item {
  return { id, number, type: "jn", prompt, options: JN_OPTIONS, correct, points: 1, explanation };
}

export function fill(id: string, number: number, prompt: string, correct: string[], explanation: string): Item {
  return { id, number, type: "fill", prompt, correct, points: 1, explanation };
}

export { REPEAT_CUE, NARRATOR };
