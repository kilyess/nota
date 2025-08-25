"use client";

import { Note } from "@prisma/client";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  noteUpdated: boolean;
  setNoteUpdated: (noteUpdated: boolean) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteTitle: "",
  setNoteTitle: () => {},
  noteUpdated: false,
  setNoteUpdated: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteUpdated, setNoteUpdated] = useState<boolean>(false);

  return (
    <NoteProviderContext.Provider
      value={{
        noteTitle,
        setNoteTitle,
        noteUpdated,
        setNoteUpdated,
      }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
};

export default NoteProvider;
