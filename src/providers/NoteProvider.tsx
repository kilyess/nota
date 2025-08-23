"use client";

import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  noteUpdatedAt: Date | null;
  setNoteUpdatedAt: (noteUpdatedAt: Date | null) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteTitle: "",
  setNoteTitle: () => {},
  noteUpdatedAt: null,
  setNoteUpdatedAt: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteUpdatedAt, setNoteUpdatedAt] = useState<Date | null>(null);

  return (
    <NoteProviderContext.Provider
      value={{ noteTitle, setNoteTitle, noteUpdatedAt, setNoteUpdatedAt }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
};

export default NoteProvider;
