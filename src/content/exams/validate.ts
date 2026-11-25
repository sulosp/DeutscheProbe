import { NARRATOR } from "@/content/exams/goethe-b1/speakers";
import {
  clipVoiceError,
  clipsForScript,
  scriptsInModule,
  teilSpeakers,
  voiceClash,
  type ExamModule,
  type MockExam,
} from "@/lib/exam-model";

function numbers(module: ExamModule) {
  return module.teile.flatMap((teil) => teil.items.map((item) => item.number));
}

export function validateGoetheB1(exam: MockExam): string[] {
  const errors: string[] = [];
  const fail = (message: string) => errors.push(message);

  if (exam.label !== "Beispieldaten") fail("Modellsatz muss als Beispieldaten gekennzeichnet sein.");
  if (exam.scoring.kind !== "goethe-modular" || exam.scoring.pass !== 60 || exam.scoring.perModuleMax !== 100) {
    fail("Goethe B1 wird pro Modul auf 100 Punkte gewertet, bestanden ab 60.");
  }

  const skills = exam.modules.map((module) => module.skill).join(",");
  if (skills !== "lesen,hoeren,schreiben,sprechen") fail(`Reihenfolge ist ${skills}.`);

  const minutes = exam.modules.map((module) => module.minutes);
  if (minutes.join(",") !== "65,40,60,15") fail(`Modulzeiten ${minutes.join(",")} stimmen nicht.`);

  const hoeren = exam.modules.find((module) => module.skill === "hoeren");
  const sprechen = exam.modules.find((module) => module.skill === "sprechen");
  if (hoeren?.transferMinutes !== 5) fail("Hören braucht 5 Minuten Übertragung.");
  if (sprechen?.prepMinutes !== 15) fail("Sprechen braucht 15 Minuten Vorbereitung.");

  const expectCounts: Record<string, number[]> = {
    lesen: [6, 6, 7, 7, 4],
    hoeren: [10, 5, 7, 8],
  };
  for (const [skill, counts] of Object.entries(expectCounts)) {
    const part = exam.modules.find((entry) => entry.skill === skill);
    if (!part) continue;
    const got = part.teile.map((teil) => teil.items.length);
    if (got.join(",") !== counts.join(",")) fail(`${skill}: Aufgabenzahl ${got.join(",")} statt ${counts.join(",")}.`);
    const raw = part.teile.reduce((sum, teil) => sum + teil.maxRaw, 0);
    if (raw !== 30) fail(`${skill}: ${raw} Rohpunkte statt 30.`);
    const seq = numbers(part);
    const want = Array.from({ length: 30 }, (_, index) => index + 1);
    if (seq.join(",") !== want.join(",")) fail(`${skill}: Nummerierung ist nicht 1 bis 30.`);
  }

  const plays = hoeren?.teile.map((teil) => {
    const stimulus = teil.stimuli.find((entry) => entry.kind === "audio");
    return stimulus && stimulus.kind === "audio" ? stimulus.audio.plays : 0;
  });
  if (plays?.join(",") !== "2,1,1,2") fail(`Hören-Wiederholungen ${plays?.join(",")} statt 2,1,1,2.`);

  const voices = hoeren?.teile.map((teil) => {
    const stimulus = teil.stimuli.find((entry) => entry.kind === "audio");
    return stimulus && stimulus.kind === "audio" ? stimulus.audio.speakers.length : 0;
  });
  if (voices?.join(",") !== "1,1,2,3") fail(`Hören-Stimmen im ersten Text ${voices?.join(",")} statt 1,1,2,3.`);

  hoeren?.teile[0]?.stimuli.forEach((stimulus) => {
    if (stimulus.kind === "audio" && stimulus.audio.speakers.length !== 1) {
      fail(`${stimulus.id} soll eine Stimme haben.`);
    }
  });

  const schreiben = exam.modules.find((module) => module.skill === "schreiben");
  const writeRaw = schreiben?.teile.map((teil) => teil.maxRaw).join(",");
  if (writeRaw !== "40,40,20") fail(`Schreiben-Punkte ${writeRaw} statt 40,40,20.`);
  if (schreiben?.teile.some((teil) => !teil.writing)) fail("Schreiben ohne Schreibaufgabe.");

  const speakRaw = sprechen?.teile.map((teil) => teil.maxRaw).join(",");
  if (speakRaw !== "28,40,16") fail(`Sprechen-Punkte ${speakRaw} statt 28,40,16.`);
  const aussprache = sprechen?.moduleRubric?.find((criterion) => criterion.id === "aussprache")?.max;
  if (aussprache !== 16) fail("Aussprache muss 16 Punkte haben.");

  for (const part of exam.modules) {
    for (const script of scriptsInModule(part)) {
      for (const clip of clipsForScript(script, NARRATOR)) {
        const clash = clipVoiceError(clip);
        if (clash) fail(clash);
      }
    }
    for (const teil of part.teile) {
      const clash = voiceClash(teilSpeakers(teil, NARRATOR));
      if (clash) fail(`Teil ${part.skill} ${teil.number}: ${clash}`);
    }
  }

  return errors;
}
