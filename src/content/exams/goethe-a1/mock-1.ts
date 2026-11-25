import type { MockExam } from "@/lib/exam-model";
import { NARRATOR } from "@/content/exams/voices";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";
import { a1Hoeren, a1HoerenIntro } from "@/content/exams/goethe-a1/hoeren";
import { a1Lesen } from "@/content/exams/goethe-a1/lesen";
import { a1Schreiben } from "@/content/exams/goethe-a1/schreiben";
import { a1Sprechen } from "@/content/exams/goethe-a1/sprechen";

export const goetheA1Mock: MockExam = {
  id: "goethe-a1-mock-1",
  trackId: "goethe-a1",
  provider: "goethe",
  level: "A1",
  title: "Goethe-Zertifikat A1 · Modellsatz 1",
  isFree: true,
  label: "Beispieldaten",
  scoring: { kind: "goethe-a1", written: 75, oral: 25, passTotal: 60 },
  breaks: [],
  modules: [
    {
      id: "hoeren",
      skill: "hoeren",
      title: "Hören",
      minutes: 20,
      transferMinutes: 2,
      intro: { text: "Hören hat drei Teile und dauert etwa 20 Minuten. Danach übertragen Sie die Lösungen.", audio: a1HoerenIntro },
      teile: a1Hoeren,
    },
    {
      id: "lesen",
      skill: "lesen",
      title: "Lesen",
      minutes: 25,
      intro: { text: "Lesen hat drei Teile und dauert 25 Minuten." },
      teile: a1Lesen,
    },
    {
      id: "schreiben",
      skill: "schreiben",
      title: "Schreiben",
      minutes: 20,
      intro: { text: "Schreiben dauert 20 Minuten: ein Formular und eine kurze Nachricht." },
      teile: a1Schreiben,
    },
    {
      id: "sprechen",
      skill: "sprechen",
      title: "Sprechen",
      minutes: 15,
      intro: { text: "Sprechen dauert etwa 15 Minuten: vorstellen, fragen und eine Bitte formulieren." },
      teile: a1Sprechen,
    },
  ],
};

const problems = [
  ...assertVoices(goetheA1Mock, NARRATOR),
  ...assertTeilCounts(goetheA1Mock, [
    { skill: "hoeren", counts: [6, 4, 5], plays: [2, 1, 2], voices: [2, 1, 1] },
    { skill: "lesen", counts: [5, 5, 5] },
    { skill: "schreiben", counts: [5, 0] },
  ]),
];
if (problems.length) throw new Error(problems.join("\n"));
