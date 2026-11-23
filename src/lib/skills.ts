import type { Skill } from "@/lib/types";

export const SKILL_ORDER: Skill[] = [
  "sprechen",
  "hoeren",
  "lesen",
  "schreiben",
  "sprachbausteine",
];

export const SKILL_LABEL: Record<Skill, string> = {
  sprechen: "Sprechen",
  hoeren: "Hören",
  lesen: "Lesen",
  schreiben: "Schreiben",
  sprachbausteine: "Sprachbausteine",
};

export const SKILL_HINT: Record<Skill, string> = {
  sprechen: "Sprechen und aufnehmen. Die Einschätzung kommt nach der Aufgabe.",
  hoeren: "Hörtext abspielen und Fragen beantworten. Die Punkte gibt es sofort.",
  lesen: "Texte lesen und zuordnen. Die Punkte gibt es sofort.",
  schreiben: "Text schreiben. Die Einschätzung kommt nach dem Abgeben.",
  sprachbausteine: "Lücken mit Grammatik und Wortschatz füllen. Die Punkte gibt es sofort.",
};

const BADGE: Record<Skill, string> = {
  sprechen: "bg-skill-sprechen-soft text-skill-sprechen",
  hoeren: "bg-skill-hoeren-soft text-skill-hoeren",
  lesen: "bg-skill-lesen-soft text-skill-lesen",
  schreiben: "bg-skill-schreiben-soft text-skill-schreiben",
  sprachbausteine: "bg-skill-sprachbausteine-soft text-skill-sprachbausteine",
};

const BAR: Record<Skill, string> = {
  sprechen: "bg-skill-sprechen-vivid",
  hoeren: "bg-skill-hoeren-vivid",
  lesen: "bg-skill-lesen-vivid",
  schreiben: "bg-skill-schreiben-vivid",
  sprachbausteine: "bg-skill-sprachbausteine-vivid",
};

export function skillBadgeClass(skill: Skill) {
  return BADGE[skill];
}

export function skillBarClass(skill: Skill) {
  return BAR[skill];
}

export function isSkill(value: string): value is Skill {
  return SKILL_ORDER.includes(value as Skill);
}
