"use client";

import { CommandProviderContext } from "@/providers/CommandProvider";
import { useContext } from "react";

function useCommandState() {
  const context = useContext(CommandProviderContext);
  if (!context) {
    throw new Error("useCommandState must be used within a CommandProvider");
  }

  return context;
}

export default useCommandState;
