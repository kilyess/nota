"use client";

import { Note } from "@prisma/client";
import { createContext, useState } from "react";

type NoteProviderContextType = {
  noteTitle: string;
  setNoteTitle: (noteTitle: string) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
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
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (note: Note) => {
    setNotes([note, ...notes]);
  };

  const updateNote = (note: Note) => {
    setNotes(
      notes
        .map((n) => (n.id === note.id ? note : n))
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    );
  };

  const deleteNote = (note: Note) => {
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
