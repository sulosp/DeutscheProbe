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

/** Neutral exam voice. Never doubles as a character inside the same Teil. */
export const NARRATOR = person("narrator", "Ansager", "narrator", "m", "de-DE-ConradNeural", "-8%", "-2Hz");

export const POOL = person("pool", "Badansage", "announcer", "m", "de-DE-KillianNeural", "-6%", "-2Hz");
export const PRAXIS = person("praxis", "Praxis Sommer", "announcer", "f", "de-DE-SeraphinaMultilingualNeural", "-4%", "+0Hz");
export const BAHNHOF = person("bahnhof", "Bahnhof", "announcer", "m", "de-CH-JanNeural", "-10%", "-4Hz");
export const RADIO = person("radio", "Stadtradio", "announcer", "f", "de-DE-KatjaNeural", "-4%", "-1Hz");
export const CEM = person("cem", "Cem", "character", "m", "de-DE-FlorianMultilingualNeural", "+6%", "+1Hz");
export const SCHULE = person("schule", "Schule", "announcer", "f", "de-DE-AmalaNeural", "+0%", "+0Hz");

export const HELBIG = person("helbig", "Frau Helbig", "character", "f", "de-CH-LeniNeural", "-4%", "+0Hz");
export const LEA = person("lea", "Lea", "character", "f", "de-DE-SeraphinaMultilingualNeural", "+4%", "+1Hz");
export const MARTIN = person("martin", "Martin", "character", "m", "de-AT-JonasNeural", "+4%", "+0Hz");

export const MODERATOR = person("moderator", "Herr Kranz", "moderator", "m", "de-DE-ChristophNeural", "-2%", "-1Hz");
export const OKONKWO = person("okonkwo", "Frau Okonkwo", "guest", "f", "de-AT-IngridNeural", "+2%", "+0Hz");
export const VOGT = person("vogt", "Herr Vogt", "guest", "m", "de-DE-FlorianMultilingualNeural", "+0%", "-1Hz");

export const PARTNERIN = person("partnerin", "Nora", "character", "f", "de-DE-TanjaNeural", "+8%", "+2Hz");
