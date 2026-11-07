import type { Attendee, BrainstormState } from "@/types";

export type AIProvider = "anthropic" | "ollama";

export interface AISettings {
  provider: AIProvider;
  anthropicApiKey: string;
  anthropicModel: string;
  ollamaUrl: string;
  ollamaModel: string;
  ideasPerTurn: number;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: "anthropic",
  anthropicApiKey: "",
  anthropicModel: "claude-haiku-5-5",
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  ideasPerTurn: 2,
};

export interface PersonaPreset {
  name: string;
  emoji: string;
  persona: string;
}

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    name: "Optimist",
    emoji: "🌞",
    persona:
      "You see opportunities everywhere. You propose bold, energising options and look for the upside for every party.",
  },
  {
    name: "Skeptic",
    emoji: "🧐",
    persona:
      "You think about what could go wrong. During brainstorming you never criticise; instead you propose options that reduce risk or test assumptions cheaply.",
  },
  {
    name: "Customer",
    emoji: "🛒",
    persona:
      "You are the end user who will live with the result. You propose options that make things simpler, faster or more pleasant for the people affected.",
  },
  {
    name: "Engineer",
    emoji: "🛠️",
    persona:
      "You are practical and hands-on. You propose concrete, feasible steps, small experiments and ways to measure success.",
  },
  {
    name: "Money-minded",
    emoji: "💶",
    persona:
      "You care about budget and value. You propose options that are cheap to try, share costs fairly or create value for everyone.",
  },
  {
    name: "Wildcard",
    emoji: "🃏",
    persona:
      "You think laterally. You borrow ideas from unrelated fields and propose surprising, unconventional options.",
  },
];

const SETTINGS_KEY = "brainstormer-ai-settings";

export function loadAISettings(): AISettings {
  if (typeof window === "undefined") return DEFAULT_AI_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return memorySettings ?? DEFAULT_AI_SETTINGS;
    return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return memorySettings ?? DEFAULT_AI_SETTINGS;
  }
}

let memorySettings: AISettings | null = null; // fallback when storage is unavailable
let cachedRaw: string | null = null;
let cachedSettings: AISettings = DEFAULT_AI_SETTINGS;
const SETTINGS_EVENT = "brainstormer-ai-settings-change";

export function saveAISettings(settings: AISettings): void {
  memorySettings = settings;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private mode); settings then last for this visit only.
  }
  window.dispatchEvent(new Event(SETTINGS_EVENT));
}

/** useSyncExternalStore helpers: a stable snapshot of the stored settings. */
export function subscribeAISettings(onChange: () => void): () => void {
  window.addEventListener(SETTINGS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SETTINGS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getAISettingsSnapshot(): AISettings {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(SETTINGS_KEY);
  } catch {
    return memorySettings ?? DEFAULT_AI_SETTINGS;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSettings = loadAISettings();
  }
  return cachedSettings;
}

export function getServerAISettingsSnapshot(): AISettings {
  return DEFAULT_AI_SETTINGS;
}

export function isAIConfigured(s: AISettings): boolean {
  return s.provider === "anthropic"
    ? s.anthropicApiKey.trim().length > 0 && s.anthropicModel.trim().length > 0
    : s.ollamaUrl.trim().length > 0 && s.ollamaModel.trim().length > 0;
}

/** Builds the prompt for one AI attendee, following the "Getting to Yes" brainstorming rules. */
export function buildPrompt(
  agent: Attendee,
  state: BrainstormState,
  count: number
): { system: string; user: string } {
  const others = state.attendees
    .filter((a) => a.id !== agent.id)
    .map((a) => (a.isAI ? `${a.name} (AI)` : a.name))
    .join(", ");
  const existing = state.ideas.map((i) => `- ${i.content}`).join("\n");

  const system = [
    `You are ${agent.name}, an attendee in a brainstorming session.`,
    agent.persona ?? "",
    "The session follows the 'Getting to Yes' method: focus on interests, not positions;",
    "invent options for mutual gain; separate the people from the problem.",
    "Brainstorming rules: never criticise or evaluate ideas, build on others' ideas, quantity before quality.",
    "Write each idea as one short, concrete sentence (at most 20 words), in the same language as the situation.",
    `Reply with JSON only, in exactly this shape: {"ideas": ["...", "..."]} with ${count} new idea(s).`,
  ]
    .filter(Boolean)
    .join(" ");

  const user = [
    `Situation: ${state.situationDescription || "(not described)"}`,
    state.interests ? `Underlying interests and needs: ${state.interests}` : "",
    state.relationshipDynamics
      ? `Relationship dynamics: ${state.relationshipDynamics}`
      : "",
    others ? `Other attendees: ${others}` : "",
    existing
      ? `Ideas already on the board (do not repeat them; you may build on them):\n${existing}`
      : "No ideas on the board yet.",
    `Propose ${count} new idea(s) in your role.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, user };
}

/** Extracts the idea list from a model reply, tolerating extra text around the JSON. */
export function parseIdeas(text: string, max: number): string[] {
  const clean = (list: unknown[]) =>
    list
      .filter((x): x is string => typeof x === "string")
      .map((x) => x.trim().replace(/^[-*•\d.)\s]+/, ""))
      .filter((x) => x.length > 0)
      .slice(0, max);

  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed?.ideas)) return clean(parsed.ideas);
    } catch {
      // fall through to line parsing
    }
  }
  return clean(text.split("\n"));
}

async function callAnthropic(s: AISettings, system: string, user: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": s.anthropicApiKey.trim(),
      "anthropic-version": "2023-06-01",
      // The key never leaves the visitor's browser except to Anthropic.
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: s.anthropicModel.trim(),
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 401) throw new Error("Claude rejected the API key. Check it in AI settings.");
    if (res.status === 404) throw new Error(`Model "${s.anthropicModel}" was not found. Check the model name in AI settings.`);
    throw new Error(`Claude request failed (${res.status}). ${detail.slice(0, 160)}`);
  }
  const data = await res.json();
  const block = Array.isArray(data?.content)
    ? data.content.find((b: { type: string }) => b.type === "text")
    : null;
  return (block?.text as string) ?? "";
}

async function callOllama(s: AISettings, system: string, user: string) {
  const base = s.ollamaUrl.trim().replace(/\/+$/, "");
  let res: Response;
  try {
    res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: s.ollamaModel.trim(),
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch {
    throw new Error(
      `Could not reach Ollama at ${base}. Is it running, and does OLLAMA_ORIGINS allow this site?`
    );
  }
  if (!res.ok) {
    throw new Error(`Ollama request failed (${res.status}). Is the model "${s.ollamaModel}" pulled?`);
  }
  const data = await res.json();
  return (data?.message?.content as string) ?? "";
}

/** Asks one AI attendee for new ideas. */
export async function generateIdeas(
  agent: Attendee,
  state: BrainstormState,
  settings: AISettings
): Promise<string[]> {
  const count = Math.min(Math.max(settings.ideasPerTurn, 1), 5);
  const { system, user } = buildPrompt(agent, state, count);
  const text =
    settings.provider === "anthropic"
      ? await callAnthropic(settings, system, user)
      : await callOllama(settings, system, user);
  return parseIdeas(text, count);
}
