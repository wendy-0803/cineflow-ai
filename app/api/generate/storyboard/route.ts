import { NextResponse } from "next/server";
import type { GeneratedStoryboard, Project } from "../../../../app/types";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const API_BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const RESPONSES_PATH = process.env.OPENAI_RESPONSES_PATH || "/responses";

const STORYBOARD_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "shots"],
  properties: {
    title: { type: "string" },
    shots: {
      type: "array",
      minItems: 6,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "sceneId",
          "index",
          "durationSec",
          "shotSize",
          "movement",
          "cameraAngle",
          "lighting",
          "composition",
          "visual",
          "action",
          "voiceover",
          "subtitle",
          "sound",
          "prompt",
          "negativePrompt",
          "continuityNote",
          "promptLayers",
          "targetTool"
        ],
        properties: {
          id: { type: "string" },
          sceneId: { type: "string" },
          index: { type: "integer" },
          durationSec: { type: "integer" },
          shotSize: { type: "string" },
          movement: { type: "string" },
          cameraAngle: { type: "string" },
          lighting: { type: "string" },
          composition: { type: "string" },
          visual: { type: "string" },
          action: { type: "string" },
          voiceover: { type: "string" },
          subtitle: { type: "string" },
          sound: { type: "string" },
          prompt: { type: "string" },
          negativePrompt: { type: "string" },
          continuityNote: { type: "string" },
          promptLayers: { type: "array", items: { type: "string" } },
          targetTool: { type: "string" }
        }
      }
    }
  }
} as const;

function extractOutputText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const maybe = data as {
    output_text?: string;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof maybe.output_text === "string" && maybe.output_text.trim()) {
    return maybe.output_text;
  }

  for (const item of maybe.output ?? []) {
    const textItem = item.content?.find((content) => content.type === "output_text" && typeof content.text === "string");
    if (textItem?.text) return textItem.text;
  }

  return null;
}

function buildInstructions(project: Project) {
  return [
    "You are a senior storyboard designer for AI video creation tools.",
    "Write in Simplified Chinese.",
    "Take the existing story package and expand it into a more detailed storyboard package.",
    "Focus on shot breakdown, camera logic, lighting, composition, continuity, and prompt usability.",
    "Do not rewrite the whole story. Refine the shot layer only.",
    "Return only JSON that matches the schema.",
    `Project title: ${project.title}`,
    `Logline: ${project.logline}`,
    `Synopsis: ${project.synopsis}`,
    `Acts: ${project.acts.join(" | ")}`,
    `Motifs: ${project.motifs.join(" | ")}`,
    `Characters: ${project.characters.map((character) => `${character.name} (${character.role})`).join(" | ")}`,
    `Scenes: ${project.scenes.map((scene) => `${scene.id}:${scene.title}`).join(" | ")}`,
    "Each shot should include cameraAngle, lighting, composition, continuityNote, promptLayers, and targetTool."
  ].join(" ");
}

function buildPrompt(project: Project) {
  return JSON.stringify(
    {
      title: project.title,
      input: project.input,
      story: {
        logline: project.logline,
        synopsis: project.synopsis,
        acts: project.acts,
        motifs: project.motifs,
        characters: project.characters,
        scenes: project.scenes
      },
      shots: project.shots.map((shot) => ({
        id: shot.id,
        sceneId: shot.sceneId,
        index: shot.index,
        durationSec: shot.durationSec,
        shotSize: shot.shotSize,
        movement: shot.movement,
        visual: shot.visual,
        action: shot.action,
        voiceover: shot.voiceover,
        subtitle: shot.subtitle,
        sound: shot.sound,
        prompt: shot.prompt,
        negativePrompt: shot.negativePrompt
      })),
      guidance: {
        refineLayer: "Make each shot more concrete and production ready.",
        continuity: "Keep the protagonist, time, emotion, and wardrobe consistent across shots.",
        promptStyle: "Break prompts into visual subject, camera, light, environment, emotion, and exclusions."
      }
    },
    null,
    2
  );
}

function toGeneratedStoryboard(raw: GeneratedStoryboard): GeneratedStoryboard {
  return {
    ...raw,
    shots: raw.shots.map((shot, index) => ({
      ...shot,
      index: shot.index ?? index + 1,
      durationSec: Number(shot.durationSec) || 5,
      promptLayers: shot.promptLayers ?? [],
      targetTool: shot.targetTool ?? "generic",
      continuityNote: shot.continuityNote ?? ""
    }))
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { project?: Project };
    if (!body.project?.shots?.length) {
      return NextResponse.json({ error: "Missing project data." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured in the environment." },
        { status: 500 }
      );
    }

    const response = await fetch(`${API_BASE_URL}${RESPONSES_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: buildPrompt(body.project),
        instructions: buildInstructions(body.project),
        max_output_tokens: 3500,
        store: false,
        temperature: 0.55,
        text: {
          format: {
            type: "json_schema",
            name: "cineflow_storyboard_package",
            schema: STORYBOARD_SCHEMA,
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed with status ${response.status}.`, details: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText = extractOutputText(data);
    if (!rawText) {
      return NextResponse.json({ error: "OpenAI response did not include text output." }, { status: 502 });
    }

    const parsed = JSON.parse(rawText) as GeneratedStoryboard;
    return NextResponse.json({ storyboard: toGeneratedStoryboard(parsed) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
