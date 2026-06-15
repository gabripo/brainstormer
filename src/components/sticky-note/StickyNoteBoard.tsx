"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Send } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import StickyNote from "./StickyNote";

interface StickyNoteBoardProps {
  showRemove?: boolean;
  disabled?: boolean;
  mode?: "brainstorm" | "review";
}

export default function StickyNoteBoard({
  showRemove = true,
  disabled = false,
  mode = "brainstorm",
}: StickyNoteBoardProps) {
  const { state, dispatch } = useBrainstorm();
  const [newIdea, setNewIdea] = useState("");

  const handleAddIdea = () => {
    if (newIdea.trim()) {
      dispatch({ type: "ADD_IDEA", payload: newIdea.trim() });
      setNewIdea("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddIdea();
    }
  };

  const visibleIdeas =
    mode === "review"
      ? state.ideas.filter((i) => !state.discardedIdeaIds.includes(i.id))
      : state.ideas;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        {visibleIdeas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
            <Lightbulb className="h-12 w-12" />
            <p className="text-lg font-medium">
              {mode === "brainstorm"
                ? "No ideas yet. Start brainstorming!"
                : "No ideas remaining."}
            </p>
            {mode === "brainstorm" && (
              <p className="text-sm">
                Type your idea below and press Enter to add it.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence mode="popLayout">
              {visibleIdeas
                .slice()
                .sort((a, b) => {
                  if (a.isPreferred !== b.isPreferred) {
                    return a.isPreferred ? -1 : 1;
                  }
                  return b.createdAt - a.createdAt;
                })
                .map((idea) => (
                  <StickyNote
                    key={idea.id}
                    idea={idea}
                    onTogglePreferred={() =>
                      dispatch({
                        type: "TOGGLE_PREFERRED",
                        payload: idea.id,
                      })
                    }
                    onRemove={() =>
                      dispatch({ type: "REMOVE_IDEA", payload: idea.id })
                    }
                    showRemove={showRemove}
                    disabled={disabled}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {mode === "brainstorm" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 bg-white p-4"
        >
          <div className="mx-auto flex max-w-2xl gap-3">
            <div className="relative flex-1">
              <Lightbulb className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                placeholder="Type your idea and press Enter..."
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-text-main placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddIdea}
              disabled={!newIdea.trim()}
              className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
