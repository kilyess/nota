"use client";

import { ApiKeyContext } from "@/providers/ApiKeyProvider";
import { useContext } from "react";

function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within a ApiKeyProvider");
  }

  return context;
}

export default useApiKey;
