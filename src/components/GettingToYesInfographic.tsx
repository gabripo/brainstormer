"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Users,
  Scale,
  Heart,
  Ban,
  Puzzle,
  ChevronDown,
  LightbulbIcon,
} from "lucide-react";
import {
  GETTING_TO_YES_PRINCIPLES,
  BRAINSTORMING_RULES,
} from "@/utils/constants";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Heart,
  Lightbulb,
  Scale,
  Ban,
  Puzzle,
};

interface GettingToYesInfographicProps {
  compact?: boolean;
  variant?: "principles" | "rules";
}

export default function GettingToYesInfographic({
  compact = false,
  variant = "principles",
}: GettingToYesInfographicProps) {
  const [isOpen, setIsOpen] = useState(true);
  const principles =
    variant === "principles"
      ? GETTING_TO_YES_PRINCIPLES
      : BRAINSTORMING_RULES;
  const title =
    variant === "principles"
      ? "Getting to Yes — Principles"
      : "Brainstorming Rules";

  if (compact) {
    return (
      <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-primary"
        >
          <span className="flex items-center gap-2">
            <LightbulbIcon className="h-4 w-4" />
            {title}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 px-4 pb-4">
                {principles.map((p, i) => {
                  const Icon = iconMap[p.lucideIcon] || Lightbulb;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs"
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <div>
                        <span className="font-semibold text-text-main">
                          {p.title}
                        </span>
                        <p className="mt-0.5 text-gray-500">{p.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <LightbulbIcon className="h-4 w-4" />
        {title}
      </h3>
      {principles.map((p, i) => {
        const Icon = iconMap[p.lucideIcon] || Lightbulb;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">0{p.id}</span>
                <span className="text-sm font-semibold text-text-main">
                  {p.title}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                {p.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
