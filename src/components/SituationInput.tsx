"use client";

import { useBrainstorm } from "@/context/BrainstormContext";
import Textarea from "@/components/ui/Textarea";

export default function SituationInput() {
  const { state, dispatch } = useBrainstorm();

  return (
    <div className="space-y-4">
      <Textarea
        id="situation"
        label="The Situation"
        placeholder="Describe the issue or decision to be addressed. Focus on facts, not on who is right or wrong."
        value={state.situationDescription}
        onChange={(e) =>
          dispatch({ type: "SET_SITUATION", payload: e.target.value })
        }
        rows={3}
      />
      <Textarea
        id="dynamics"
        label="Relationships & Dynamics"
        placeholder="What personal dynamics, relationships, or communication patterns are involved? Naming them helps separate the people from the problem."
        value={state.relationshipDynamics}
        onChange={(e) =>
          dispatch({
            type: "SET_RELATIONSHIP_DYNAMICS",
            payload: e.target.value,
          })
        }
        rows={2}
      />
      <p className="text-xs text-gray-400">
        Principle 1 — Separate people from the problem. Describe the situation
        neutrally and make personal dynamics explicit so they can be addressed
        openly.
      </p>
    </div>
  );
}
