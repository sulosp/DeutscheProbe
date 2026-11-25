import { getTask } from "@/content";
import { findTeil } from "@/content/exams";
import { assessSpeaking, assessWriting } from "@/lib/scoring";
import { assessSpeakingTask, assessWritingTask } from "@/lib/scoring-rules";
import type { Feedback } from "@/lib/types";
import { NextResponse } from "next/server";

type Body = {
  taskId?: string;
  mockId?: string;
  teilId?: string;
  text?: string;
  notes?: string;
  checklist?: string[];
  durationSec?: number;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Body;
  const text = (body.text ?? "").slice(0, 8000);
  const notes = (body.notes ?? "").slice(0, 4000);
  const checklist = Array.isArray(body.checklist) ? body.checklist.map(String).slice(0, 12) : [];
  const durationSec = Number.isFinite(body.durationSec) ? Math.max(0, Math.round(body.durationSec ?? 0)) : 0;

  const located = body.teilId ? findTeil(body.teilId) : null;
  const examTeil = located && (!body.mockId || located.exam.id === body.mockId) ? located : null;
  const task = !examTeil && body.taskId ? getTask(body.taskId) : null;
  if (examTeil && !examTeil.teil.writing && !examTeil.teil.speaking) {
    return NextResponse.json({ error: "Für diesen Teil gibt es keine Texteinschätzung." }, { status: 400 });
  }
  if (!examTeil && (!task || (!task.writing && !task.speaking))) {
    return NextResponse.json({ error: "Unbekannte Aufgabe." }, { status: 400 });
  }

  const mock = examTeil?.teil.writing
    ? assessWritingTask(examTeil.teil.writing, text)
    : examTeil?.teil.speaking
      ? assessSpeakingTask(examTeil.teil.speaking, { notes, checklist, durationSec })
      : task?.writing
        ? assessWriting(task, text)
        : assessSpeaking(task!, { notes, checklist }, durationSec);
  const level = examTeil?.exam.level ?? task?.level;
  const skill = examTeil?.module.skill ?? task?.skill;
  const title = examTeil?.teil.title ?? task?.title ?? "";
  const situation = examTeil?.teil.writing?.situation ?? examTeil?.teil.speaking?.situation ?? task?.writing?.situation ?? task?.speaking?.situation ?? "";

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json(mock);

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const criteria = (mock.criteria ?? [])
      .map((item) => `${item.id} max ${item.max} (${item.label})`)
      .join(", ");
    const prompt = [
      "Du bewertest eine Deutschprüfung als Übung. Antworte nur mit JSON.",
      "Keine offizielle Note, keine Musterlösung in voller Länge.",
      `Niveau ${level}, Fertigkeit ${skill}, Titel: ${title}.`,
      "Bei Schreiben gilt: ist die Aufgabenerfüllung 0, ist die ganze Aufgabe 0.",
      `Kriterien: ${criteria}.`,
      "Form: {\"summary\":string,\"criteria\":[{\"id\":string,\"label\":string,\"points\":number,\"max\":number,\"comment\":string}],\"strengths\":string[],\"improvements\":string[]}",
      `Situation: ${situation}`,
      `Text: ${text || "(kein Text)"}`,
      `Notizen: ${notes || "(keine)"}`,
      `Markierte Stichpunkte: ${checklist.join("; ") || "(keine)"}`,
      `Aufnahmedauer in Sekunden: ${durationSec}`,
    ].join("\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 },
        }),
      },
    );
    if (!response.ok) return NextResponse.json(mock);
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const json = raw.replace(/^```json\s*/i, "").replace(/```$/i, "");
    const parsed = JSON.parse(json) as Partial<Feedback>;
    const criteriaOut = (mock.criteria ?? []).map((item) => {
      const match = parsed.criteria?.find((entry) => entry.id === item.id);
      const points = Math.max(0, Math.min(item.max, Math.round(match?.points ?? item.points)));
      return { ...item, points, comment: match?.comment || item.comment };
    });
    const erfuellung = criteriaOut.find((item) => item.id === "erfuellung");
    if (skill === "schreiben" && erfuellung && erfuellung.points === 0) {
      criteriaOut.forEach((item) => {
        item.points = 0;
      });
    }
    const score = criteriaOut.reduce((sum, item) => sum + item.points, 0);
    const maxScore = criteriaOut.reduce((sum, item) => sum + item.max, 0) || mock.maxScore;
    const feedback: Feedback = {
      source: "gemini",
      score,
      maxScore,
      percent: maxScore ? Math.round((score / maxScore) * 100) : 0,
      summary: parsed.summary || mock.summary,
      criteria: criteriaOut,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String).slice(0, 4) : mock.strengths,
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String).slice(0, 4) : mock.improvements,
    };
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json(mock);
  }
}
