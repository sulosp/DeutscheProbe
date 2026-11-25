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

/** Calm exam voice. Not used as a character in the same Teil. */
export const NARRATOR = person("narrator", "Ansager", "narrator", "m", "de-DE-ConradNeural", "-8%", "-2Hz");

export const TANJA = person("tanja", "Tanja", "character", "f", "de-DE-SeraphinaMultilingualNeural", "+2%", "+1Hz");
export const JONAS = person("jonas", "Jonas", "character", "m", "de-DE-FlorianMultilingualNeural", "+2%", "+0Hz");
export const INGRID = person("ingrid", "Ingrid", "announcer", "f", "de-DE-KatjaNeural", "-14%", "-2Hz");
export const JAN = person("jan", "Jan", "announcer", "m", "de-CH-JanNeural", "-14%", "-3Hz");
export const LENI = person("leni", "Leni", "character", "f", "de-CH-LeniNeural", "+0%", "+0Hz");
export const ANDREW = person("andrew", "Andreas", "character", "m", "de-DE-ChristophNeural", "+0%", "+0Hz");
export const BRIAN = person("brian", "Kilian", "character", "m", "de-DE-KillianNeural", "+4%", "+2Hz");
export const AVA = person("ava", "Amala", "character", "f", "de-DE-AmalaNeural", "+4%", "+2Hz");
export const EMMA = person("emma", "Ingrid", "character", "f", "de-AT-IngridNeural", "+0%", "+0Hz");
export const REMY = person("remy", "Jonas", "character", "m", "de-AT-JonasNeural", "+2%", "-1Hz");
export const VIVIENNE = person("vivienne", "Tanja", "character", "f", "de-DE-TanjaNeural", "+4%", "+1Hz");
export const GIUSEPPE = person("giuseppe", "Andrew", "character", "m", "en-US-AndrewMultilingualNeural", "+0%", "+0Hz");

export function asSpeaker(base: Speaker, id: string, name: string, role: Speaker["role"] = base.role): Speaker {
  return { ...base, id, name, role };
}
