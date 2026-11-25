import type { MockExam } from "@/lib/exam-model";
import { NARRATOR } from "@/content/exams/voices";
import { assertTeilCounts, assertVoices } from "@/content/exams/validate";
import { b2Hoeren, b2HoerenIntro } from "@/content/exams/goethe-b2/hoeren";
import { b2Lesen } from "@/content/exams/goethe-b2/lesen";
import { b2Schreiben, b2Sprechen } from "@/content/exams/goethe-b2/rest";

export const goetheB2Mock: MockExam = {
  id: "goethe-b2-mock-1",
  trackId: "goethe-b2",
  provider: "goethe",
  level: "B2",
  title: "Goethe-Zertifikat B2 · Modellsatz 1",
  isFree: true,
  label: "Beispieldaten",
  scoring: { kind: "goethe-modular", perModuleMax: 100, pass: 60, convert: { lesen: "x100/30", hoeren: "x100/30" } },
  breaks: [
    { afterModuleId: "lesen", minutes: 15, kind: "pause" },
    { afterModuleId: "hoeren", minutes: 15, kind: "pause" },
  ],
  modules: [
    { id: "lesen", skill: "lesen", title: "Lesen", minutes: 65, intro: { text: "Lesen hat fünf Teile und dauert 65 Minuten." }, teile: b2Lesen },
    {
      id: "hoeren",
      skill: "hoeren",
      title: "Hören",
      minutes: 40,
      transferMinutes: 5,
      intro: { text: "Hören hat vier Teile. Danach haben Sie fünf Minuten für den Antwortbogen.", audio: b2HoerenIntro },
      teile: b2Hoeren,
    },
    { id: "schreiben", skill: "schreiben", title: "Schreiben", minutes: 75, intro: { text: "Schreiben dauert 75 Minuten: ein Forumsbeitrag und eine Nachricht an die Leitung." }, teile: b2Schreiben },
    {
      id: "sprechen",
      skill: "sprechen",
      title: "Sprechen",
      minutes: 15,
      prepMinutes: 15,
      intro: { text: "Sprechen dauert etwa 15 Minuten, dazu 15 Minuten Vorbereitung: Vortrag und Diskussion." },
      teile: b2Sprechen,
      moduleRubric: [{ id: "aussprache", label: "Aussprache", max: 16 }],
    },
  ],
};

const problems = [
  ...assertVoices(goetheB2Mock, NARRATOR),
  ...assertTeilCounts(goetheB2Mock, [
    { skill: "lesen", counts: [9, 6, 6, 6, 3] },
    { skill: "hoeren", counts: [10, 6, 6, 8], plays: [1, 2, 1, 2], voices: [2, 2, 3, 1] },
  ]),
];
if (goetheB2Mock.modules[0].teile.reduce((sum, teil) => sum + teil.items.length, 0) !== 30) problems.push("B2 Lesen nicht 30");
if (goetheB2Mock.modules[1].teile.reduce((sum, teil) => sum + teil.items.length, 0) !== 30) problems.push("B2 Hören nicht 30");
if (problems.length) throw new Error(problems.join("\n"));
