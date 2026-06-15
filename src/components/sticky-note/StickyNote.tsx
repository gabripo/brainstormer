"use client";

import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import type { Idea } from "@/types";

interface StickyNoteProps {
  idea: Idea;
  onTogglePreferred: () => void;
  onRemove: () => void;
  showRemove?: boolean;
  disabled?: boolean;
}

export default function StickyNote({
  idea,
  onTogglePreferred,
  onRemove,
  showRemove = true,
  disabled = false,
}: StickyNoteProps) {
  const color = (() => {
    try {
      return JSON.parse(idea.color);
    } catch {
      return { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" };
    }
  })();

  const randomRotation = (() => {
    const hash = idea.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return (hash % 7) - 3;
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, rotate: randomRotation }}
      animate={{ opacity: 1, scale: 1, rotate: randomRotation }}
      exit={{ opacity: 0, scale: 0.5, rotate: randomRotation * 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
      className="group relative w-[220px] cursor-default select-none"
    >
      <div
        className="sticky-note-shadow rounded-2xl p-4 pt-6 transition-shadow duration-200"
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
          borderWidth: "2px",
        }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div
            className="h-3 w-8 rounded-sm opacity-60"
            style={{ backgroundColor: color.border }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onTogglePreferred();
          }}
          className={`absolute right-2 top-2 rounded-full p-1 transition-all duration-200 ${
            idea.isPreferred
              ? "text-amber-500 scale-110"
              : "text-gray-300 opacity-0 group-hover:opacity-100"
          } ${disabled ? "cursor-default" : "cursor-pointer hover:scale-125"}`}
        >
          <Star
            className={`h-4 w-4 ${idea.isPreferred ? "fill-amber-500" : ""}`}
          />
        </button>

        <p
          className="break-words text-sm leading-relaxed font-medium pr-5"
          style={{ color: color.text }}
        >
          {idea.content}
        </p>

        {showRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) onRemove();
            }}
            className={`absolute -bottom-2 -right-2 rounded-full bg-white p-1.5 shadow-md border border-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-red-50 hover:border-red-200 ${
              disabled ? "hidden" : "cursor-pointer"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
