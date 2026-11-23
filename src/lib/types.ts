export type ExamId = "goethe" | "telc";
export type Level = "A1" | "A2" | "B1" | "B2";
export type Skill = "sprechen" | "hoeren" | "lesen" | "schreiben" | "sprachbausteine";

export type Choice = { id: string; label: string };

export type ObjectiveItem = {
  id: string;
  prompt: string;
  options: Choice[];
  correct: string;
  explanation: string;
};

export type Passage = { id: string; title: string; body: string };

export type WritingBrief = {
  situation: string;
  bullets: string[];
  minWords: number;
  maxWords: number;
  register: string;
  signals: string[];
};

export type SpeakingBrief = {
  situation: string;
  prompts: string[];
  partnerLines?: { name: string; text: string }[];
  checklist: string[];
};

export type Task = {
  id: string;
  exam: ExamId;
  level: Level;
  skill: Skill;
  title: string;
  teil: string;
  minutes: number;
  intro: string;
  passages?: Passage[];
  audio?: { heading: string; script: string };
  items?: ObjectiveItem[];
  writing?: WritingBrief;
  speaking?: SpeakingBrief;
};

export type Criterion = {
  id: string;
  label: string;
  points: number;
  max: number;
  comment: string;
};

export type ItemReview = {
  id: string;
  correct: boolean;
  chosen?: string;
  explanation: string;
};

export type Feedback = {
  source: "auto" | "mock" | "gemini";
  score: number;
  maxScore: number;
  percent: number;
  summary: string;
  criteria?: Criterion[];
  strengths?: string[];
  improvements?: string[];
  items?: ItemReview[];
};

export type Draft = {
  answers: Record<string, string>;
  text: string;
  notes: string;
  checklist: string[];
};

export type TaskResult = {
  taskId: string;
  skill: Skill;
  answers: Record<string, string>;
  text: string;
  notes: string;
  checklist: string[];
  durationSec: number;
  feedback: Feedback;
};

export type Attempt = {
  id: string;
  trackId: string;
  mode: "practice" | "exam";
  createdAt: string;
  result: TaskResult;
};

export type Profile = {
  name: string;
  email: string;
  exam: ExamId;
  level: Level;
  goal: string;
  examInDays: number;
  onboarded: boolean;
  auth: "demo" | "supabase";
};

export type AppState = {
  profile: Profile | null;
  attempts: Attempt[];
};

export type PauseKind = "none" | "module" | "oral";

export type ExamPart = {
  skill: Skill;
  taskId: string;
  minutes: number;
  prepMinutes: number;
  label: string;
  detail: string;
  pauseAfter: PauseKind;
};

export type SampleStat = {
  percent: number;
  done: number;
  total: number;
  points: number;
};

export type SampleResult = {
  when: string;
  taskId: string;
  score: number;
};

export type Track = {
  id: string;
  exam: ExamId;
  level: Level;
  title: string;
  hello: "Hallo" | "Guten Tag";
  tagline: string;
  layout: "goethe" | "telc";
  skills: Skill[];
  parts: ExamPart[];
  recommendedTaskId: string;
  recommendReason: string;
  quickTaskIds: string[];
  sampleStreak: number;
  sampleMinutesToday: number;
  sampleWeek: boolean[];
  sampleProgress: Partial<Record<Skill, SampleStat>>;
  sampleResults: SampleResult[];
};
