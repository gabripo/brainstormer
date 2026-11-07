export type AppPhase = "setup" | "brainstorm" | "review" | "complete";

export interface Attendee {
  id: string;
  name: string;
  isMediator: boolean;
  /** AI attendees generate ideas through a language model. */
  isAI?: boolean;
  /** How an AI attendee thinks and what it cares about. */
  persona?: string;
}

export interface Idea {
  id: string;
  content: string;
  isPreferred: boolean;
  createdAt: number;
  color: string;
  /** Set when an AI attendee proposed the idea. */
  authorName?: string;
  authorIsAI?: boolean;
}

export interface BrainstormState {
  phase: AppPhase;
  situationDescription: string;
  relationshipDynamics: string;
  interests: string;
  attendees: Attendee[];
  ideas: Idea[];
  discardedIdeaIds: string[];
}

export type BrainstormAction =
  | { type: "SET_SITUATION"; payload: string }
  | { type: "SET_RELATIONSHIP_DYNAMICS"; payload: string }
  | { type: "SET_INTERESTS"; payload: string }
  | { type: "ADD_ATTENDEE"; payload: string }
  | { type: "ADD_AI_ATTENDEE"; payload: { name: string; persona: string } }
  | { type: "REMOVE_ATTENDEE"; payload: string }
  | { type: "SET_MEDIATOR"; payload: string }
  | { type: "START_BRAINSTORM" }
  | { type: "ADD_IDEA"; payload: string }
  | { type: "ADD_AI_IDEA"; payload: { content: string; authorName: string } }
  | { type: "TOGGLE_PREFERRED"; payload: string }
  | { type: "REMOVE_IDEA"; payload: string }
  | { type: "END_BRAINSTORM" }
  | { type: "DISCARD_IDEA"; payload: string }
  | { type: "RESTORE_IDEA"; payload: string }
  | { type: "COMPLETE_SESSION" }
  | { type: "RESET_SESSION" };
