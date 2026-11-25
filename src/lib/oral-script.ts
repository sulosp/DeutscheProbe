import type { OralCue, OralEngine, Teil } from "@/lib/exam-model";

export const EXAMINER_NAME = "Frau Berger";
export const EXAMINER_ROLE = "Prüferin";
export const PARTNER_ROLE = "Prüfungspartnerin";

export function scriptedOral(cues: OralCue[]): OralEngine {
  return {
    lineAt(index) {
      return cues[index] ?? null;
    },
  };
}

export function oralScript(teil: Teil): OralCue[] {
  const task = teil.speaking;
  if (!task) return [];
  if (task.cues?.length) return task.cues;

  const partnerName = task.partnerLines?.[0]?.name ?? "Nora";
  const solo = Boolean(task.topics) && !task.partnerLines?.length;
  const cues: OralCue[] = [];
  if (teil.number === 1) {
    cues.push({
      role: "examiner",
      name: EXAMINER_NAME,
      text: "Guten Tag. Ich bin Frau Berger und leite die mündliche Prüfung. Wir beginnen.",
    });
  }
  cues.push({
    role: "examiner",
    name: EXAMINER_NAME,
    text: `Teil ${teil.number}. ${teil.instruction} Bitte beginnen Sie.`,
    reply: solo,
  });
  if (!solo) {
    const opener = task.partnerLines?.[0]?.text ?? task.prompts[0] ?? task.situation;
    cues.push({ role: "partner", name: partnerName, text: opener, reply: true });
    const rest = task.partnerLines?.[0] ? task.prompts : task.prompts.slice(1);
    rest.forEach((prompt) => {
      const point = prompt.replace(/\?$/, "");
      cues.push({
        role: "partner",
        name: partnerName,
        text: `Einverstanden. Und ${point}? Was schlagen Sie vor?`,
        reply: true,
      });
    });
  } else {
    cues.push({
      role: "examiner",
      name: EXAMINER_NAME,
      text: "Danke. Was ist für Sie der wichtigste Punkt?",
      reply: true,
    });
  }
  cues.push({
    role: "examiner",
    name: EXAMINER_NAME,
    text: `Vielen Dank. Das war Teil ${teil.number}.`,
  });
  return cues;
}

export function hasPartner(teil: Teil) {
  return oralScript(teil).some((cue) => cue.role === "partner");
}

export function partnerName(teil: Teil) {
  return oralScript(teil).find((cue) => cue.role === "partner")?.name ?? "Nora";
}
