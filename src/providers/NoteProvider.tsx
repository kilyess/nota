"use client";

import { Note } from "@prisma/client";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  noteUpdated: boolean;
  setNoteUpdated: (noteUpdated: boolean) => void;
  noteCreated: Note | null;
  setNoteCreated: (noteCreated: Note | null) => void;
  noteDeleted: string | null;
  setNoteDeleted: (noteDeleted: string | null) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteTitle: "",
  setNoteTitle: () => {},
  noteUpdated: false,
  setNoteUpdated: () => {},
  noteCreated: null,
  setNoteCreated: () => {},
  noteDeleted: null,
  setNoteDeleted: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteUpdated, setNoteUpdated] = useState<boolean>(false);
  const [noteCreated, setNoteCreated] = useState<Note | null>(null);
  const [noteDeleted, setNoteDeleted] = useState<string | null>(null);
  return (
    <NoteProviderContext.Provider
      value={{
        noteTitle,
        setNoteTitle,
        noteUpdated,
        setNoteUpdated,
        noteCreated,
        setNoteCreated,
        noteDeleted,
        setNoteDeleted,
      }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
};

export default NoteProvider;
