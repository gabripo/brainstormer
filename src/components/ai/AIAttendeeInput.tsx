"use client";

import { useState } from "react";
import { Bot, Plus } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import { PERSONA_PRESETS } from "@/utils/ai";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export default function AIAttendeeInput() {
  const { state, dispatch } = useBrainstorm();
  const [showCustom, setShowCustom] = useState(false);
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");

  const taken = new Set(state.attendees.map((a) => a.name.toLowerCase()));

  const addCustom = () => {
    if (!name.trim() || !persona.trim()) return;
    dispatch({ type: "ADD_AI_ATTENDEE", payload: { name: name.trim(), persona: persona.trim() } });
    setName("");
    setPersona("");
    setShowCustom(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <Bot className="h-3.5 w-3.5" />
        Add AI attendees: each one throws ideas from its own point of view
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PERSONA_PRESETS.map((p) => {
          const already = taken.has(p.name.toLowerCase());
          return (
            <button
              key={p.name}
              type="button"
              disabled={already}
              title={p.persona}
              onClick={() =>
                dispatch({ type: "ADD_AI_ATTENDEE", payload: { name: p.name, persona: p.persona } })
              }
              className="flex items-center gap-1 rounded-full border border-dashed border-violet-300 bg-violet-50/60 px-2.5 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden>{p.emoji}</span>
              {p.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-gray-400"
        >
          <Plus className="h-3 w-3" />
          Custom
        </button>
      </div>

      {showCustom && (
        <div className="space-y-2 rounded-xl border border-violet-200 bg-violet-50/40 p-3">
          <Input
            placeholder="Name, e.g. Head of Sales"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="How does this attendee think? e.g. Cares about winning new customers quickly and keeping the sales team motivated."
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!name.trim() || !persona.trim()}
            className="w-full rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            Add AI attendee
          </button>
        </div>
      )}
    </div>
  );
}
