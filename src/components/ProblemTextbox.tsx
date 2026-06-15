"use client";

import { useBrainstorm } from "@/context/BrainstormContext";
import Textarea from "@/components/ui/Textarea";

export default function ProblemTextbox() {
  const { state, dispatch } = useBrainstorm();

  return (
    <div className="space-y-2">
      <Textarea
        id="problem"
        label="The Problem"
        placeholder="Describe the problem or issue to brainstorm..."
        value={state.problemDescription}
        onChange={(e) =>
          dispatch({ type: "SET_PROBLEM", payload: e.target.value })
        }
        rows={4}
      />
      <p className="text-xs text-gray-400">
        Be specific. A well-defined problem leads to better solutions.
      </p>
    </div>
  );
}
