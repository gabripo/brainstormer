export type AppPhase = "setup" | "brainstorm" | "review" | "complete";

export interface Attendee {
  id: string;
  name: string;
  isMediator: boolean;
}

export interface Idea {
  id: string;
  content: string;
  isPreferred: boolean;
  createdAt: number;
  color: string;
}

export interface BrainstormState {
  phase: AppPhase;
  problemDescription: string;
  attendees: Attendee[];
  ideas: Idea[];
  discardedIdeaIds: string[];
}

export type BrainstormAction =
  | { type: "SET_PROBLEM"; payload: string }
  | { type: "ADD_ATTENDEE"; payload: string }
  | { type: "REMOVE_ATTENDEE"; payload: string }
  | { type: "SET_MEDIATOR"; payload: string }
  | { type: "START_BRAINSTORM" }
  | { type: "ADD_IDEA"; payload: string }
  | { type: "TOGGLE_PREFERRED"; payload: string }
  | { type: "REMOVE_IDEA"; payload: string }
  | { type: "END_BRAINSTORM" }
  | { type: "DISCARD_IDEA"; payload: string }
  | { type: "RESTORE_IDEA"; payload: string }
  | { type: "COMPLETE_SESSION" }
  | { type: "RESET_SESSION" };
