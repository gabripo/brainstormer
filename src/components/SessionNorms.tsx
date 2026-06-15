"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Norm {
  id: number;
  label: string;
  principle: string;
}

const NORMS: Norm[] = [
  { id: 1, label: "Separate people from the problem", principle: "Be soft on people, hard on the problem." },
  { id: 2, label: "Focus on interests, not positions", principle: "Uncover the real needs behind each stance." },
  { id: 3, label: "Defer judgment", principle: "No criticism during brainstorming. All ideas are welcome." },
  { id: 4, label: "Build on others' ideas", principle: 'Use "Yes, and..." to expand and combine ideas.' },
  { id: 5, label: "Invent options for mutual gain", principle: "Brainstorm multiple solutions before deciding." },
  { id: 6, label: "Insist on objective criteria", principle: "Use fair standards to evaluate, not pressure." },
];

export default function SessionNorms() {
  const [agreed, setAgreed] = useState<number[]>([]);

  const toggleNorm = (id: number) => {
    setAgreed((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <span className="text-sm font-medium text-text-main/80">
          Session Norms
        </span>
        <p className="text-xs text-gray-400 mt-0.5">
          The mediator should guide the group to commit to these norms before starting.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {NORMS.map((norm, i) => {
          const isAgreed = agreed.includes(norm.id);
          return (
            <motion.button
              key={norm.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleNorm(norm.id)}
              className={`group relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-all duration-200 cursor-pointer ${
                isAgreed
                  ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-text-main"
              }`}
              title={norm.principle}
            >
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 ${
                  isAgreed
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-transparent"
                }`}
              >
                {isAgreed && <Check className="h-3.5 w-3.5" />}
              </div>
              <span className="text-left text-xs leading-tight">
                {norm.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
