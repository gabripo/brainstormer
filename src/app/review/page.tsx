"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Undo2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import PageTransition from "@/components/PageTransition";
import ProgressIndicator from "@/components/ProgressIndicator";
import GettingToYesInfographic from "@/components/GettingToYesInfographic";
import StickyNote from "@/components/sticky-note/StickyNote";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ReviewPage() {
  const router = useRouter();
  const { state, dispatch, resetSession } = useBrainstorm();

  useEffect(() => {
    if (state.phase === "setup") {
      router.replace("/setup");
    } else if (state.phase === "brainstorm") {
      router.replace("/brainstorm");
    }
  }, [state.phase, router]);

  const keptIdeas = state.ideas.filter(
    (i) => !state.discardedIdeaIds.includes(i.id)
  );
  const discardedIdeas = state.ideas.filter((i) =>
    state.discardedIdeaIds.includes(i.id)
  );

  const handleFinalize = () => {
    dispatch({ type: "COMPLETE_SESSION" });
  };

  const handleStartNew = () => {
    resetSession();
    router.push("/setup");
  };

  if (state.phase === "setup" || state.phase === "brainstorm") {
    return null;
  }

  if (state.phase === "complete") {
    const finalKept = state.ideas.filter(
      (i) => !state.discardedIdeaIds.includes(i.id)
    );
    const preferred = finalKept.filter((i) => i.isPreferred);
    const nonPreferred = finalKept.filter((i) => !i.isPreferred);

    return (
      <PageTransition className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
            >
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </motion.div>
            <h1 className="text-3xl font-bold text-text-main">
              Brainstorming Complete!
            </h1>
            <p className="mt-2 text-gray-500">
              Here are the final results from your session.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <Sparkles className="h-4 w-4" />
              The Problem
            </div>
            <p className="text-lg font-medium text-text-main">
              {state.situationDescription}
            </p>
            {state.interests && (
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Interests & Needs
                </div>
                <p className="text-sm text-amber-900">{state.interests}</p>
              </div>
            )}
            {state.relationshipDynamics && (
              <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Relationship Dynamics
                </div>
                <p className="text-sm text-blue-900">
                  {state.relationshipDynamics}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <Crown className="h-4 w-4" />
              Team
            </div>
            <div className="flex flex-wrap gap-2">
              {state.attendees.map((a) => (
                <Badge
                  key={a.id}
                  variant={a.isMediator ? "mediator" : "default"}
                >
                  {a.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-text-main">
              Selected Ideas ({finalKept.length})
            </h2>
            {finalKept.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
                No ideas were kept.
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <AnimatePresence>
                  {[...preferred, ...nonPreferred].map((idea) => (
                    <StickyNote
                      key={idea.id}
                      idea={idea}
                      onTogglePreferred={() => {}}
                      onRemove={() => {}}
                      showRemove={false}
                      disabled
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={handleStartNew}>
              <RotateCcw className="h-5 w-5" />
              Start New Session
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/brainstorm")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-text-main transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <ProgressIndicator
            currentStep={3}
            totalSteps={3}
            labels={["Setup", "Brainstorm", "Review"]}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {keptIdeas.length} kept &middot; {discardedIdeas.length} discarded
          </span>
          <Button
            size="sm"
            onClick={handleFinalize}
            disabled={keptIdeas.length === 0}
          >
            <CheckCircle2 className="h-4 w-4" />
            Finalize
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold text-text-main">
              Keep — {keptIdeas.length} ideas
            </h2>
            {keptIdeas.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 p-8 text-gray-400">
                No ideas kept. Move ideas from the discarded section back.
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <AnimatePresence mode="popLayout">
                  {keptIdeas
                    .slice()
                    .sort((a, b) => {
                      if (a.isPreferred !== b.isPreferred)
                        return a.isPreferred ? -1 : 1;
                      return b.createdAt - a.createdAt;
                    })
                    .map((idea) => (
                      <motion.div
                        key={idea.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <StickyNote
                          idea={idea}
                          onTogglePreferred={() =>
                            dispatch({
                              type: "TOGGLE_PREFERRED",
                              payload: idea.id,
                            })
                          }
                          onRemove={() =>
                            dispatch({
                              type: "DISCARD_IDEA",
                              payload: idea.id,
                            })
                          }
                          showRemove
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-l border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-500">
              <Trash2 className="h-4 w-4" />
              Discarded ({discardedIdeas.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {discardedIdeas.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No discarded ideas.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {discardedIdeas.map((idea) => {
                    const color = (() => {
                      try {
                        return JSON.parse(idea.color);
                      } catch {
                        return {
                          bg: "#FEF3C7",
                          border: "#F59E0B",
                          text: "#92400E",
                        };
                      }
                    })();
                    return (
                      <motion.div
                        key={idea.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 0.6, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group relative rounded-xl p-3 text-sm transition-all duration-200"
                        style={{
                          backgroundColor: color.bg,
                          borderColor: color.border,
                          borderWidth: "1px",
                        }}
                      >
                        <p
                          className="pr-6 line-through"
                          style={{ color: color.text }}
                        >
                          {idea.content}
                        </p>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "RESTORE_IDEA",
                              payload: idea.id,
                            })
                          }
                          className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-accent/10"
                        >
                          <Undo2 className="h-3.5 w-3.5 text-accent" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 p-4">
            <GettingToYesInfographic compact variant="principles" />
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
