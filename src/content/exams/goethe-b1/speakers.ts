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
export const NARRATOR = person("narrator", "Ansager", "narrator", "m", "de-DE-ChristophNeural", "-5%");

/** Teil 1 needs seven voices. The six de-DE/AT/CH voices cover narrator and five texts; the example uses a multilingual voice. */
export const POOL = person("pool", "Badansage", "announcer", "m", "en-US-AndrewMultilingualNeural", "-8%");
export const PRAXIS = person("praxis", "Praxis Sommer", "announcer", "f", "de-DE-TanjaNeural");
export const BAHNHOF = person("bahnhof", "Bahnhof", "announcer", "m", "de-CH-JanNeural", "-4%");
export const RADIO = person("radio", "Stadtradio", "announcer", "f", "de-AT-IngridNeural");
export const CEM = person("cem", "Cem", "character", "m", "de-AT-JonasNeural");
export const SCHULE = person("schule", "Schule", "announcer", "f", "de-CH-LeniNeural");

export const HELBIG = person("helbig", "Frau Helbig", "character", "f", "de-CH-LeniNeural", "-2%");
export const LEA = person("lea", "Lea", "character", "f", "de-DE-TanjaNeural");
export const MARTIN = person("martin", "Martin", "character", "m", "de-AT-JonasNeural");

export const MODERATOR = person("moderator", "Herr Kranz", "moderator", "m", "en-US-BrianMultilingualNeural", "-8%");
export const OKONKWO = person("okonkwo", "Frau Okonkwo", "guest", "f", "de-AT-IngridNeural", "+2%");
export const VOGT = person("vogt", "Herr Vogt", "guest", "m", "de-CH-JanNeural", "+2%");

export const PARTNERIN = person("partnerin", "Nora", "character", "f", "fr-FR-VivienneMultilingualNeural", "-6%");
