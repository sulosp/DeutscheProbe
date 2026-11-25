import type { MockExam } from "@/lib/exam-model";
import { NARRATOR } from "@/content/exams/voices";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";
import { a2Hoeren, a2HoerenIntro } from "@/content/exams/goethe-a2/hoeren";
import { a2Lesen } from "@/content/exams/goethe-a2/lesen";
import { a2Schreiben, a2Sprechen } from "@/content/exams/goethe-a2/rest";

export const goetheA2Mock: MockExam = {
  id: "goethe-a2-mock-1",
  trackId: "goethe-a2",
  provider: "goethe",
  level: "A2",
  title: "Goethe-Zertifikat A2 · Modellsatz 1",
  isFree: true,
  label: "Beispieldaten",
  scoring: { kind: "goethe-a2", perModuleMax: 25, scale: 1.25, passTotal: 60, passWritten: 45, passOral: 15 },
  breaks: [],
  modules: [
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 30, intro: { text: "Lesen hat vier Teile und dauert 30 Minuten." }, teile: a2Lesen },
    {
      id: "hoeren",
      skill: "hoeren",
      title: "Hören",
      minutes: 30,
      transferMinutes: 2,
      intro: { text: "Hören hat vier Teile. In der Prüfung können Sie nicht pausieren.", audio: a2HoerenIntro },
      teile: a2Hoeren,
    },
    { id: "schreiben", skill: "schreiben", title: "Schreiben", minutes: 30, intro: { text: "Schreiben dauert 30 Minuten: eine Nachricht und eine E-Mail." }, teile: a2Schreiben },
    { id: "sprechen", skill: "sprechen", title: "Sprechen", minutes: 15, intro: { text: "Sprechen dauert etwa 15 Minuten zu zweit." }, teile: a2Sprechen },
  ],
};

const problems = [
  ...assertVoices(goetheA2Mock, NARRATOR),
  ...assertTeilCounts(goetheA2Mock, [
    { skill: "lesen", counts: [5, 5, 5, 5] },
    { skill: "hoeren", counts: [5, 5, 5, 5], plays: [2, 1, 1, 2], voices: [1, 2, 2, 2] },
    { skill: "schreiben", counts: [0, 0] },
  ]),
];
if (problems.length) throw new Error(problems.join("\n"));
