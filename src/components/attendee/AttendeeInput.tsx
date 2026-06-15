"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";
import { useBrainstorm } from "@/context/BrainstormContext";
import Input from "@/components/ui/Input";

export default function AttendeeInput() {
  const { dispatch } = useBrainstorm();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      dispatch({ type: "ADD_ATTENDEE", payload: name.trim() });
      setName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Add attendee name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleAdd}
        disabled={!name.trim()}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
