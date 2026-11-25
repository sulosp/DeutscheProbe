import { goetheA1Mock } from "../src/content/exams/goethe-a1/mock-1";
import { goetheA2Mock } from "../src/content/exams/goethe-a2/mock-1";
import { goetheB1Mock } from "../src/content/exams/goethe-b1/mock-1";
import { goetheB2Mock } from "../src/content/exams/goethe-b2/mock-1";
import { telcB1Mock } from "../src/content/exams/telc-b1/mock-1";
import { validateGoetheB1 } from "../src/content/exams/validate";
import { convertMesspunkte, passGoetheA1, passGoetheA2, passTelc300, passTelc60, scoreMockExam } from "../src/lib/scoring-rules";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const shape = validateGoetheB1(goetheB1Mock);
assert(shape.length === 0, shape.join("\n"));

assert(convertMesspunkte(30) === 100, "30");
assert(convertMesspunkte(27) === 90, "27");
assert(convertMesspunkte(24) === 80, "24");
assert(convertMesspunkte(21) === 70, "21");
assert(convertMesspunkte(18) === 60, "18");
assert(convertMesspunkte(15) === 50, "15");
assert(convertMesspunkte(17) === 57, "17");

const a2FailOral = passGoetheA2({ lesen: 16, hoeren: 16, schreiben: 16, sprechen: 14 });
assert(a2FailOral.total === 62 && a2FailOral.passed === false, "A2 mündlich knapp unter der Grenze");
const a2Pass = passGoetheA2({ lesen: 16, hoeren: 16, schreiben: 16, sprechen: 15 });
assert(a2Pass.passed === true, "A2 bestanden");
const a2FailWritten = passGoetheA2({ lesen: 14, hoeren: 15, schreiben: 15, sprechen: 16 });
assert(a2FailWritten.total === 60 && a2FailWritten.written === 44 && a2FailWritten.passed === false, "A2 schriftlich");

const telcFail = passTelc300({ lesen: 50, sprachbausteine: 20, hoeren: 40, schreiben: 24, sprechen: 45 });
assert(telcFail.written === 134 && telcFail.passed === false, "telc schriftlich 134");
const telcPass = passTelc300({ lesen: 50, sprachbausteine: 20, hoeren: 40, schreiben: 25, sprechen: 45 });
assert(telcPass.written === 135 && telcPass.oral === 45 && telcPass.passed === true, "telc Grenze");
const telcOral = passTelc300({ lesen: 75, sprachbausteine: 30, hoeren: 75, schreiben: 45, sprechen: 44 });
assert(telcOral.passed === false && telcOral.grade === "teilgenommen", "telc mündlich");

const telc60 = passTelc60({ hoeren: 15, lesen: 15, schreiben: 15, sprechen: 15 });
assert(telc60.total === 60 && telc60.grade === "sehr gut" && telc60.passed, "telc 60");
assert(passTelc60({ hoeren: 10, lesen: 10, schreiben: 8, sprechen: 7 }).passed === false, "telc 60 fail");

const a1 = passGoetheA1({ hoeren: 15, lesen: 15, schreiben: 15, sprechen: 15 });
assert(a1.total === 100 && a1.passed, "A1 voll");
assert(passGoetheA1({ hoeren: 9, lesen: 9, schreiben: 9, sprechen: 8 }).passed === false, "A1 knapp");

const blank = scoreMockExam(goetheB1Mock, { answers: {}, writing: {}, speaking: {} });
assert(blank.modules.length === 4, "vier Module");
assert(blank.modules.every((module) => module.points === 0 && module.passed === false), "leer nicht bestanden");
assert(blank.rule === "goethe-modular", "Regel");

const answers: Record<string, string> = {};
for (const part of goetheB1Mock.modules) {
  if (part.skill !== "lesen" && part.skill !== "hoeren") continue;
  for (const teil of part.teile) {
    for (const item of teil.items) {
      answers[item.id] = Array.isArray(item.correct) ? item.correct[0] : item.correct;
    }
  }
}
const full = scoreMockExam(goetheB1Mock, { answers, writing: {}, speaking: {} });
const lesen = full.modules.find((module) => module.skill === "lesen");
const hoeren = full.modules.find((module) => module.skill === "hoeren");
assert(lesen?.points === 100 && lesen.passed, "Lesen voll");
assert(hoeren?.points === 100 && hoeren.passed, "Hören voll");
assert(full.passed === false, "Schreiben und Sprechen fehlen noch");

assert(goetheA1Mock.modules.map((part) => part.skill).join(",") === "hoeren,lesen,schreiben,sprechen", "A1 Reihenfolge");
assert(goetheA2Mock.scoring.kind === "goethe-a2", "A2 Regel");
assert(goetheB2Mock.modules[0].teile.reduce((sum, teil) => sum + teil.maxRaw, 0) === 30, "B2 Lesen 30");
const a1Full = scoreMockExam(goetheA1Mock, {
  answers: Object.fromEntries(
    goetheA1Mock.modules.flatMap((part) => part.teile.flatMap((teil) => teil.items.map((item) => [item.id, Array.isArray(item.correct) ? item.correct[0] : item.correct]))),
  ),
  writing: {},
  speaking: {},
});
assert(a1Full.written !== undefined && a1Full.oral === 0, "A1 mündlich leer");
assert(a1Full.passed === false, "A1 ohne Sprechen nicht bestanden");
const a2Raw = scoreMockExam(goetheA2Mock, {
  answers: Object.fromEntries(
    goetheA2Mock.modules.flatMap((part) => part.teile.flatMap((teil) => teil.items.map((item) => [item.id, Array.isArray(item.correct) ? item.correct[0] : item.correct]))),
  ),
  writing: {},
  speaking: {},
});
const a2Speak = a2Raw.modules.find((entry) => entry.skill === "sprechen");
assert(a2Speak?.points === 0 && a2Raw.passed === false, "A2 ohne Sprechen nicht bestanden");

const telcAnswers = Object.fromEntries(
  telcB1Mock.modules.flatMap((part) =>
    part.teile.flatMap((teil) => teil.items.map((item) => [item.id, Array.isArray(item.correct) ? item.correct[0] : item.correct])),
  ),
);
const telcFull = scoreMockExam(telcB1Mock, { answers: telcAnswers, writing: {}, speaking: {} });
assert(telcFull.written === 75 + 30 + 75, `telc schriftlich ohne Aufsatz ${telcFull.written}`);
assert(telcFull.passed === false, "telc ohne mündlich nicht bestanden");

console.log("scoring checks ok");
