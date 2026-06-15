"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
  useRef,
} from "react";
import type { BrainstormState, BrainstormAction, Attendee, Idea } from "@/types";
import { loadState, saveState, clearState } from "@/utils/storage";
import { getRandomStickyColor } from "@/utils/colors";

const initialState: BrainstormState = {
  phase: "setup",
  problemDescription: "",
  attendees: [],
  ideas: [],
  discardedIdeaIds: [],
};

function brainstormReducer(
  state: BrainstormState,
  action: BrainstormAction
): BrainstormState {
  switch (action.type) {
    case "SET_PROBLEM":
      return { ...state, problemDescription: action.payload };

    case "ADD_ATTENDEE": {
      const trimmed = action.payload.trim();
      if (!trimmed) return state;
      const newAttendee: Attendee = {
        id: crypto.randomUUID(),
        name: trimmed,
        isMediator: state.attendees.length === 0,
      };
      return { ...state, attendees: [...state.attendees, newAttendee] };
    }

    case "REMOVE_ATTENDEE": {
      const filtered = state.attendees.filter((a) => a.id !== action.payload);
      const hadMediator = state.attendees.find(
        (a) => a.id === action.payload
      )?.isMediator;
      if (hadMediator && filtered.length > 0) {
        filtered[0].isMediator = true;
      }
      return { ...state, attendees: filtered };
    }

    case "SET_MEDIATOR":
      return {
        ...state,
        attendees: state.attendees.map((a) => ({
          ...a,
          isMediator: a.id === action.payload,
        })),
      };

    case "START_BRAINSTORM":
      return { ...state, phase: "brainstorm" };

    case "ADD_IDEA": {
      const trimmed = action.payload.trim();
      if (!trimmed) return state;
      const color = getRandomStickyColor();
      const newIdea: Idea = {
        id: crypto.randomUUID(),
        content: trimmed,
        isPreferred: false,
        createdAt: Date.now(),
        color: JSON.stringify(color),
      };
      return { ...state, ideas: [...state.ideas, newIdea] };
    }

    case "TOGGLE_PREFERRED":
      return {
        ...state,
        ideas: state.ideas.map((i) =>
          i.id === action.payload ? { ...i, isPreferred: !i.isPreferred } : i
        ),
      };

    case "REMOVE_IDEA":
      return {
        ...state,
        ideas: state.ideas.filter((i) => i.id !== action.payload),
      };

    case "END_BRAINSTORM":
      return { ...state, phase: "review" };

    case "DISCARD_IDEA":
      return {
        ...state,
        discardedIdeaIds: [...state.discardedIdeaIds, action.payload],
      };

    case "RESTORE_IDEA":
      return {
        ...state,
        discardedIdeaIds: state.discardedIdeaIds.filter(
          (id) => id !== action.payload
        ),
      };

    case "COMPLETE_SESSION":
      return { ...state, phase: "complete" };

    case "RESET_SESSION":
      return { ...initialState };

    default:
      return state;
  }
}

interface BrainstormContextValue {
  state: BrainstormState;
  dispatch: React.Dispatch<BrainstormAction>;
  resetSession: () => void;
}

const BrainstormContext = createContext<BrainstormContextValue | null>(null);

export function BrainstormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(brainstormReducer, initialState, () => {
    const saved = loadState();
    return saved || initialState;
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveState(state);
    }, 500);
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state]);

  const resetSession = useCallback(() => {
    dispatch({ type: "RESET_SESSION" });
    clearState();
  }, []);

  return (
    <BrainstormContext.Provider value={{ state, dispatch, resetSession }}>
      {children}
    </BrainstormContext.Provider>
  );
}

export function useBrainstorm() {
  const ctx = useContext(BrainstormContext);
  if (!ctx) {
    throw new Error("useBrainstorm must be used within BrainstormProvider");
  }
  return ctx;
}
