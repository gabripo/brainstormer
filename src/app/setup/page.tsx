"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Users, Target, BookOpen, CheckSquare } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import PageTransition from "@/components/PageTransition";
import ProgressIndicator from "@/components/ProgressIndicator";
import GettingToYesInfographic from "@/components/GettingToYesInfographic";
import SituationInput from "@/components/SituationInput";
import InterestsInput from "@/components/InterestsInput";
import SessionNorms from "@/components/SessionNorms";
import AttendeeList from "@/components/attendee/AttendeeList";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const sections = [
  { id: "situation", icon: BookOpen, label: "The Situation" },
  { id: "interests", icon: Target, label: "Interests & Needs" },
  { id: "team", icon: Users, label: "The Team" },
  { id: "norms", icon: CheckSquare, label: "Session Norms" },
];

export default function SetupPage() {
  const router = useRouter();
  const { state, dispatch } = useBrainstorm();
  const [starting, setStarting] = useState(false);

  const canStart =
    state.situationDescription.trim().length > 0 &&
    state.attendees.length >= 2 &&
    state.attendees.some((a) => a.isMediator);

  useEffect(() => {
    if (starting && state.phase === "brainstorm") {
      router.push("/brainstorm");
    }
  }, [starting, state.phase, router]);

  const handleStart = () => {
    if (canStart) {
      dispatch({ type: "START_BRAINSTORM" });
      setStarting(true);
    }
  };

  return (
    <PageTransition className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        <div className="mb-8 flex items-center justify-center">
          <ProgressIndicator
            currentStep={1}
            totalSteps={3}
            labels={["Setup", "Brainstorm", "Review"]}
          />
        </div>

        <div className="flex flex-1 gap-8 lg:flex-row flex-col">
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="mb-3 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-text-main">
                  Brainstormer
                </h1>
              </div>
              <p className="text-gray-500">
                Frame your session using{" "}
                <span className="font-medium text-text-main">
                  Getting to Yes
                </span>{" "}
                principled negotiation.
              </p>
            </motion.div>

            <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
              {sections.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  <s.icon className="h-3 w-3" />
                  {s.label}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Card className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-text-main">
                    1. The Situation
                  </span>
                </div>
                <SituationInput />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <Card className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-text-main">
                    2. Interests & Needs
                  </span>
                </div>
                <InterestsInput />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Card className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-text-main">
                    3. The Team
                  </span>
                </div>
                <AttendeeList />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <Card className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-semibold text-text-main">
                    4. Session Norms
                  </span>
                </div>
                <SessionNorms />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="flex justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                className="min-w-[220px]"
              >
                Brainstorm!
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:w-80 shrink-0"
          >
            <div className="lg:sticky lg:top-8 space-y-4">
              <GettingToYesInfographic variant="principles" />
              <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Mediator Tip
                </h4>
                <p className="text-xs leading-relaxed text-gray-600">
                  The mediator keeps the session aligned with these principles.
                  Guide the group to separate people from the problem, uncover
                  interests, and defer judgment during brainstorming.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
