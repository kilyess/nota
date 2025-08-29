"use client";

import { createContext, useState } from "react";

type ApiKeyProviderContextType = {
  apiKey: string | null;
  setApiKey: (apiKey: string | null) => void;
};

export const ApiKeyContext = createContext<ApiKeyProviderContextType>({
  apiKey: null,
  setApiKey: () => {},
});

export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
