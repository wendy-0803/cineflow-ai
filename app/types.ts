export type ViewKey =
  | "dashboard"
  | "new"
  | "script"
  | "storyboard"
  | "export"
  | "history";

export type ProjectStatus = "draft" | "script" | "storyboard" | "exported";

export type ProjectInput = {
  brief: string;
  genre: string;
  style: string;
  duration: string;
  platform: string;
  audience: string;
  protagonist: string;
  mood: string;
  language: string;
};

export type Character = {
  name: string;
  role: string;
  appearance: string;
  motivation: string;
  consistencyPrompt: string;
};

export type Scene = {
  id: string;
  title: string;
  purpose: string;
  summary: string;
};

export type Shot = {
  id: string;
  sceneId: string;
  index: number;
  durationSec: number;
  shotSize: string;
  movement: string;
  cameraAngle?: string;
  lighting?: string;
  composition?: string;
  visual: string;
  action: string;
  voiceover: string;
  subtitle: string;
  sound: string;
  prompt: string;
  negativePrompt: string;
  continuityNote?: string;
  promptLayers?: string[];
  targetTool?: string;
};

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  updatedAt: string;
  versions: number;
  input: ProjectInput;
  logline: string;
  synopsis: string;
  acts: string[];
  motifs: string[];
  characters: Character[];
  scenes: Scene[];
  shots: Shot[];
};

export type GeneratedStory = {
  title: string;
  logline: string;
  synopsis: string;
  acts: string[];
  motifs: string[];
  characters: Character[];
  scenes: Scene[];
  shots: Shot[];
};

export type GeneratedStoryboard = {
  title: string;
  shots: Shot[];
};
