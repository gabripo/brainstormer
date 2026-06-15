import type { BrainstormState } from "@/types";

const STORAGE_KEY = "brainstormer-state";

interface PersistedState {
  version: number;
  savedAt: number;
  data: BrainstormState;
}

const CURRENT_VERSION = 1;

export function loadState(): BrainstormState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: PersistedState = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION) {
      clearState();
      return null;
    }
    return parsed.data;
  } catch {
    clearState();
    return null;
  }
}

export function saveState(state: BrainstormState): void {
  try {
    const payload: PersistedState = {
      version: CURRENT_VERSION,
      savedAt: Date.now(),
      data: state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}
