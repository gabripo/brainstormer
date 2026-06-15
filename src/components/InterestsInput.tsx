"use client";

import { useBrainstorm } from "@/context/BrainstormContext";
import Textarea from "@/components/ui/Textarea";

export default function InterestsInput() {
  const { state, dispatch } = useBrainstorm();

  return (
    <div className="space-y-2">
      <Textarea
        id="interests"
        label="Interests & Needs"
        placeholder="What does each party truly need or care about? Look beyond stated positions to underlying motivations. (e.g., respect, stability, efficiency, fairness, autonomy)"
        value={state.interests}
        onChange={(e) =>
          dispatch({ type: "SET_INTERESTS", payload: e.target.value })
        }
        rows={3}
      />
      <p className="text-xs text-gray-400">
        Principle 2 — Focus on interests, not positions. Ask &quot;why?&quot; to uncover
        the real needs behind each party&apos;s stance.
      </p>
    </div>
  );
}
