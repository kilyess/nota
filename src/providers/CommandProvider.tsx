"use client";

import { createContext, useState } from "react";

type CommandProviderContextType = {
  commandOpen: boolean;
  setCommandOpen: (commandOpen: boolean) => void;
  toggleCommandOpen: () => void;
};

export const CommandProviderContext = createContext<CommandProviderContextType>(
  {
    commandOpen: false,
    setCommandOpen: () => {},
    toggleCommandOpen: () => {},
  },
);

const CommandProvider = ({ children }: { children: React.ReactNode }) => {
  const [commandOpen, setCommandOpen] = useState<boolean>(false);

  const toggleCommandOpen = () => {
    setCommandOpen((prev) => !prev);
  };

  return (
    <CommandProviderContext.Provider
      value={{ commandOpen, setCommandOpen, toggleCommandOpen }}
    >
      {children}
    </CommandProviderContext.Provider>
  );
};

export default CommandProvider;
