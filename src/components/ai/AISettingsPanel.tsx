"use client";

import { useState, useSyncExternalStore } from "react";
import { Settings2, KeyRound, Server } from "lucide-react";
import {
  getAISettingsSnapshot,
  getServerAISettingsSnapshot,
  isAIConfigured,
  saveAISettings,
  subscribeAISettings,
  type AISettings,
} from "@/utils/ai";
import Input from "@/components/ui/Input";

interface Props {
  defaultOpen?: boolean;
}

export default function AISettingsPanel({ defaultOpen = false }: Props) {
  // Settings live in this browser only; the server snapshot keeps prerendering deterministic.
  const settings = useSyncExternalStore(
    subscribeAISettings,
    getAISettingsSnapshot,
    getServerAISettingsSnapshot
  );
  const [open, setOpen] = useState(defaultOpen);

  const update = (patch: Partial<AISettings>) => {
    saveAISettings({ ...settings, ...patch });
  };

  const configured = isAIConfigured(settings);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-text-main"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          AI settings
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {configured
            ? settings.provider === "anthropic"
              ? "Claude ready"
              : "Ollama ready"
            : "Not set up"}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 px-4 py-3 text-sm">
          <div className="flex gap-2" role="radiogroup" aria-label="AI provider">
            {(
              [
                ["anthropic", "Claude (API key)", KeyRound],
                ["ollama", "Ollama (local)", Server],
              ] as const
            ).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={settings.provider === value}
                onClick={() => update({ provider: value })}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  settings.provider === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {settings.provider === "anthropic" ? (
            <>
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Anthropic API key</span>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="sk-ant-..."
                  value={settings.anthropicApiKey}
                  onChange={(e) => update({ anthropicApiKey: e.target.value })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Model</span>
                <Input
                  value={settings.anthropicModel}
                  onChange={(e) => update({ anthropicModel: e.target.value })}
                />
              </label>
              <p className="text-[11px] leading-relaxed text-gray-400">
                Your key is stored only in this browser and sent only to Anthropic. Usage is billed to your account.
              </p>
            </>
          ) : (
            <>
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Ollama address</span>
                <Input
                  value={settings.ollamaUrl}
                  onChange={(e) => update({ ollamaUrl: e.target.value })}
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-gray-500">Model</span>
                <Input
                  value={settings.ollamaModel}
                  onChange={(e) => update({ ollamaModel: e.target.value })}
                />
              </label>
              <p className="text-[11px] leading-relaxed text-gray-400">
                Free and private: runs on your own machine. Start Ollama with{" "}
                <code className="rounded bg-gray-100 px-1">OLLAMA_ORIGINS=*</code> so this page may talk to it.
              </p>
            </>
          )}

          <label className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">Ideas per AI attendee, per round</span>
            <select
              value={settings.ideasPerTurn}
              onChange={(e) => update({ ideasPerTurn: Number(e.target.value) })}
              className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
