"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Crown } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import AttendeeInput from "./AttendeeInput";

export default function AttendeeList() {
  const { state, dispatch } = useBrainstorm();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-main/80">
          Attendees
        </label>
        <span className="text-xs text-gray-400">
          {state.attendees.length} added
        </span>
      </div>

      <AttendeeInput />

      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {state.attendees.map((attendee) => (
            <motion.div
              key={attendee.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2 transition-all duration-200 cursor-pointer ${
                attendee.isMediator
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() =>
                dispatch({
                  type: "SET_MEDIATOR",
                  payload: attendee.id,
                })
              }
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  attendee.isMediator
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {attendee.name.charAt(0).toUpperCase()}
              </div>
              <span
                className={`text-sm font-medium ${
                  attendee.isMediator ? "text-primary" : "text-text-main"
                }`}
              >
                {attendee.name}
              </span>
              {attendee.isMediator && (
                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  <Crown className="h-3 w-3" />
                  Mediator
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({
                    type: "REMOVE_ATTENDEE",
                    payload: attendee.id,
                  });
                }}
                className="ml-1 rounded-full p-0.5 text-gray-300 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {state.attendees.length === 0 && (
        <p className="text-center text-xs text-gray-400 py-4">
          Add at least 2 attendees. The first person added becomes the mediator.
        </p>
      )}
    </div>
  );
}
