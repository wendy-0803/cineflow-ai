import { NextResponse } from "next/server";
import type { GeneratedStory, ProjectInput } from "../../../types";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const API_BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const RESPONSES_PATH = process.env.OPENAI_RESPONSES_PATH || "/responses";

const STORY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "logline", "synopsis", "acts", "motifs", "characters", "scenes", "shots"],
  properties: {
    title: { type: "string" },
    logline: { type: "string" },
    synopsis: { type: "string" },
    acts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" }
    },
    motifs: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: { type: "string" }
    },
    characters: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "role", "appearance", "motivation", "consistencyPrompt"],
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          appearance: { type: "string" },
          motivation: { type: "string" },
          consistencyPrompt: { type: "string" }
        }
      }
    },
    scenes: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "purpose", "summary"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          purpose: { type: "string" },
          summary: { type: "string" }
        }
      }
    },
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
          "visual",
          "action",
          "voiceover",
          "subtitle",
          "sound",
          "prompt",
          "negativePrompt"
        ],
        properties: {
          id: { type: "string" },
          sceneId: { type: "string" },
          index: { type: "integer" },
          durationSec: { type: "integer" },
          shotSize: { type: "string" },
          movement: { type: "string" },
          visual: { type: "string" },
          action: { type: "string" },
          voiceover: { type: "string" },
          subtitle: { type: "string" },
          sound: { type: "string" },
          prompt: { type: "string" },
          negativePrompt: { type: "string" }
        }
      }
    }
  }
} as const;

function escapeJsonLike(text: string) {
  return text.replaceAll("```json", "```").replaceAll("```", "");
}

function buildInstructions(input: ProjectInput) {
  return [
    "You are a senior AI video product strategist and screenwriter.",
    "Write in Simplified Chinese.",
    "Generate a compact but production-ready short film script package for short-video creators.",
    "Focus on three things: story clarity, shot consistency, and video-prompt usability.",
    "Keep the result cinematic but practical. Avoid vague prose.",
    "Make the shot list match the target duration and platform.",
    `Target brief: ${input.brief}`,
    `Target genre: ${input.genre}`,
    `Target style: ${input.style}`,
    `Target duration: ${input.duration}`,
    `Target platform: ${input.platform}`,
    "Return only JSON that matches the provided schema."
  ].join(" ");
}

function buildPrompt(input: ProjectInput) {
  return JSON.stringify(
    {
      brief: input.brief,
      genre: input.genre,
      style: input.style,
      duration: input.duration,
      platform: input.platform,
      audience: input.audience,
      protagonist: input.protagonist,
      mood: input.mood,
      language: input.language,
      guidance: {
        title: "Generate a memorable short title",
        acts: "Keep exactly 3 acts",
        motifs: "Choose 4 to 6 recurring visual motifs",
        characters: "Create 2 to 4 characters with strong visual consistency",
        scenes: "Create 3 to 5 scenes with clear story purpose",
        shots:
          "Create 6 to 12 shots with consistent shot ids, scene ids, duration, camera movement, voiceover, subtitle, and generation prompt",
        promptStyle:
          "Each prompt should be directly usable in AI video tools like Jimeng, Kling, Runway, and similar tools"
      }
    },
    null,
    2
  );
}

function extractOutputText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const maybe = data as {
    output_text?: string;
    output?: Array<{
      type?: string;
      content?: Array<{ type?: string; text?: string }>;
      status?: string;
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

function toGeneratedStory(raw: GeneratedStory): GeneratedStory {
  return {
    ...raw,
    shots: raw.shots.map((shot, index) => ({
      ...shot,
      index: shot.index ?? index + 1,
      durationSec: Number(shot.durationSec) || 5
    }))
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { input?: ProjectInput };
    if (!body.input?.brief || !body.input?.genre || !body.input?.style || !body.input?.duration || !body.input?.platform) {
      return NextResponse.json({ error: "Missing required input fields." }, { status: 400 });
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
        input: buildPrompt(body.input),
        instructions: buildInstructions(body.input),
        max_output_tokens: 3000,
        store: false,
        temperature: 0.7,
        text: {
          format: {
            type: "json_schema",
            name: "cineflow_story_package",
            schema: STORY_SCHEMA,
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

    const parsed = JSON.parse(rawText) as GeneratedStory;
    return NextResponse.json({ story: toGeneratedStory(parsed) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
