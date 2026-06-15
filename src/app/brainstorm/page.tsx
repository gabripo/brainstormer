"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Lightbulb, ArrowLeft } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import PageTransition from "@/components/PageTransition";
import ProgressIndicator from "@/components/ProgressIndicator";
import GettingToYesInfographic from "@/components/GettingToYesInfographic";
import StickyNoteBoard from "@/components/sticky-note/StickyNoteBoard";
import Button from "@/components/ui/Button";

export default function BrainstormPage() {
  const router = useRouter();
  const { state, dispatch } = useBrainstorm();
  const [showRules, setShowRules] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (finishing && state.phase === "review") {
      router.push("/review");
    }
  }, [finishing, state.phase, router]);

  useEffect(() => {
    if (state.phase === "setup") {
      router.replace("/setup");
    } else if (state.phase === "review" || state.phase === "complete") {
      router.replace("/review");
    }
  }, [state.phase, router]);

  const handleFinish = () => {
    dispatch({ type: "END_BRAINSTORM" });
    setFinishing(true);
  };

  return (
    <PageTransition className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              dispatch({ type: "RESET_SESSION" });
              router.push("/setup");
            }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-text-main transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </button>
          <div className="hidden sm:block">
            <ProgressIndicator
              currentStep={2}
              totalSteps={3}
              labels={["Setup", "Brainstorm", "Review"]}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <Lightbulb className="h-4 w-4" />
            <span>{state.ideas.length} ideas</span>
          </div>

          <Button size="sm" onClick={handleFinish} disabled={state.ideas.length === 0}>
            <CheckCircle className="h-4 w-4" />
            Brainstormed!
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col">
          <div className="border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent px-6 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-secondary shrink-0" />
              <span className="font-medium text-text-main line-clamp-1">
                {state.situationDescription}
              </span>
            </div>
            {state.interests && (
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 pl-6">
                <span className="font-medium">Interests:</span>
                <span className="line-clamp-1">{state.interests}</span>
              </div>
            )}
            {state.relationshipDynamics && (
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400 pl-6">
                <span className="font-medium">Dynamics:</span>
                <span className="line-clamp-1">{state.relationshipDynamics}</span>
              </div>
            )}
          </div>

          <StickyNoteBoard mode="brainstorm" showRemove />
        </main>

        <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l border-gray-200 bg-white p-4">
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center justify-between text-sm font-semibold text-primary mb-3"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Brainstorming Tips
            </span>
            <motion.span
              animate={{ rotate: showRules ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>
          {showRules && <GettingToYesInfographic compact={false} variant="rules" />}
        </aside>
      </div>
    </PageTransition>
  );
}
