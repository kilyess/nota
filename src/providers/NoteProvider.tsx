"use client";

import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteTitle: "",
  setNoteTitle: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");

  return (
    <NoteProviderContext.Provider value={{ noteTitle, setNoteTitle }}>
      {children}
    </NoteProviderContext.Provider>
  );
};

export default NoteProvider;
