"use client";

import { Note } from "@prisma/client";
import { createContext, useState } from "react";

type NoteWithBody = Pick<
  Note,
  "id" | "title" | "pinned" | "updatedAt" | "createdAt" | "authorId"
> & { body: string };

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  notes: NoteWithBody[];
  setNotes: (notes: NoteWithBody[]) => void;
  addNote: (note: NoteWithBody) => void;
  updateNote: (note: NoteWithBody) => void;
  deleteNote: (note: NoteWithBody) => void;
};

export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteTitle: "",
  setNoteTitle: () => {},
  notes: [],
  setNotes: () => {},
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
});

const NoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [notes, setNotes] = useState<NoteWithBody[]>([]);

  const addNote = (note: NoteWithBody) => {
    setNotes([note, ...notes]);
  };

  const updateNote = (note: NoteWithBody) => {
    setNotes(
      notes
        .map((n) => (n.id === note.id ? note : n))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    );
  };

  const deleteNote = (note: NoteWithBody) => {
    setNotes(notes.filter((n) => n.id !== note.id));
  };
  return (
    <NoteProviderContext.Provider
      value={{
        noteTitle,
        setNoteTitle,
        notes,
        setNotes,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteProviderContext.Provider>
  );
};

export default NoteProvider;
