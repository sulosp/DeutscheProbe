import type { Speaker } from "@/lib/exam-model";

function person(
  id: string,
  name: string,
  role: Speaker["role"],
  gender: Speaker["gender"],
  voice: string,
  rate = "+0%",
  pitch = "+0Hz",
): Speaker {
  return { id, name, role, gender, voice, rate, pitch };
}

export const NARRATOR = person("narrator", "Ansager", "narrator", "m", "de-DE-ChristophNeural", "-5%");

export const TANJA = person("tanja", "Tanja", "character", "f", "de-DE-TanjaNeural");
export const JONAS = person("jonas", "Jonas", "character", "m", "de-AT-JonasNeural");
export const INGRID = person("ingrid", "Ingrid", "character", "f", "de-AT-IngridNeural");
export const JAN = person("jan", "Jan", "character", "m", "de-CH-JanNeural", "-4%");
export const LENI = person("leni", "Leni", "character", "f", "de-CH-LeniNeural");
export const ANDREW = person("andrew", "Andrew", "character", "m", "en-US-AndrewMultilingualNeural", "-8%");
export const BRIAN = person("brian", "Brian", "character", "m", "en-US-BrianMultilingualNeural", "-8%");
export const AVA = person("ava", "Ava", "character", "f", "en-US-AvaMultilingualNeural", "-8%");
export const EMMA = person("emma", "Emma", "character", "f", "en-US-EmmaMultilingualNeural", "-8%");
export const VIVIENNE = person("vivienne", "Vivienne", "character", "f", "fr-FR-VivienneMultilingualNeural", "-6%");
export const REMY = person("remy", "Remy", "character", "m", "fr-FR-RemyMultilingualNeural", "-6%");
export const GIUSEPPE = person("giuseppe", "Giuseppe", "character", "m", "it-IT-GiuseppeMultilingualNeural", "-6%");

export function asSpeaker(base: Speaker, id: string, name: string, role: Speaker["role"] = base.role): Speaker {
  return { ...base, id, name, role };
}
