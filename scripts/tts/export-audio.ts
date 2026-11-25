import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { goetheB1Mock } from "../../src/content/exams/goethe-b1/mock-1";
import { NARRATOR } from "../../src/content/exams/goethe-b1/speakers";
import { REPEAT_CUE, clipVoiceError, clipsForScript, scriptsInModule, teilSpeakers, voiceClash, type AudioClip } from "../../src/lib/exam-model";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const clips: AudioClip[] = [];
const seen = new Set<string>();

function add(clip: AudioClip) {
  const error = clipVoiceError(clip);
  if (error) throw new Error(error);
  if (seen.has(clip.id)) return;
  seen.add(clip.id);
  clips.push(clip);
}

for (const part of goetheB1Mock.modules) {
  for (const script of scriptsInModule(part)) {
    for (const clip of clipsForScript(script, NARRATOR)) add(clip);
    if (script.repeatCue && script.repeatCue !== REPEAT_CUE) {
      add({
        id: `${script.id}__repeat`,
        speakers: [NARRATOR],
        lines: [{ speaker: NARRATOR.id, text: script.repeatCue }],
      });
    }
  }
  for (const teil of part.teile) {
    const clash = voiceClash(teilSpeakers(teil, NARRATOR));
    if (clash) throw new Error(`${part.skill} Teil ${teil.number}: ${clash}`);
  }
}

const payload = {
  narrator: NARRATOR,
  repeat: REPEAT_CUE,
  headphone: "Kopfhörer-Prüfung. Sie hören diese Stimme und danach ein Signal. Wenn beides klar ist, kann die Prüfung starten.",
  clips: clips.map((clip) => ({
    id: clip.id,
    lines: clip.lines.map((line, index) => {
      const speaker = clip.speakers.find((entry) => entry.id === line.speaker);
      if (!speaker) throw new Error(`${clip.id}: Sprecher ${line.speaker} fehlt`);
      const next = clip.lines[index + 1];
      const pauseAfterMs = line.pauseAfterMs ?? (next ? (next.speaker === line.speaker ? 250 : 550) : 0);
      return {
        speaker: speaker.id,
        voice: speaker.voice,
        rate: speaker.rate ?? "+0%",
        pitch: speaker.pitch ?? "+0Hz",
        text: line.text,
        pauseAfterMs,
      };
    }),
  })),
  teile: goetheB1Mock.modules.flatMap((part) =>
    part.teile.map((teil) => ({
      id: `${part.skill}-${teil.number}`,
      voices: teilSpeakers(teil, NARRATOR).map((speaker) => ({ id: speaker.id, voice: speaker.voice })),
    })),
  ),
};

const out = resolve(root, "scripts/tts/audio-scripts.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(payload, null, 2));
console.log(`exported ${payload.clips.length} clips`);
