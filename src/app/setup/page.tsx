"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, ArrowRight } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import PageTransition from "@/components/PageTransition";
import ProgressIndicator from "@/components/ProgressIndicator";
import GettingToYesInfographic from "@/components/GettingToYesInfographic";
import ProblemTextbox from "@/components/ProblemTextbox";
import AttendeeList from "@/components/attendee/AttendeeList";
import Button from "@/components/ui/Button";

export default function SetupPage() {
  const router = useRouter();
  const { state, dispatch } = useBrainstorm();

  const canStart =
    state.problemDescription.trim().length > 0 &&
    state.attendees.length >= 2 &&
    state.attendees.some((a) => a.isMediator);

  const handleStart = () => {
    if (canStart) {
      dispatch({ type: "START_BRAINSTORM" });
      router.push("/brainstorm");
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
          <div className="flex-1 space-y-8">
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
                Set the stage for a productive brainstorming session.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <ProblemTextbox />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <AttendeeList />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex justify-center lg:justify-start"
            >
              <Button
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
                className="min-w-[200px]"
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
            <GettingToYesInfographic variant="principles" />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
