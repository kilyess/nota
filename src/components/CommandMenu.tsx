"use client";

import { createNoteAction, getDecryptedNoteAction } from "@/actions/notes";
import useCommandState from "@/hooks/use-command-state";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type Props = {
  notes: Note[];
};

export default function CommandMenu({ notes: initialNotes }: Props) {
  const { id: noteId } = useParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const { commandOpen, toggleCommandOpen } = useCommandState();
  const router = useRouter();

  const { notes, addNote, setNotes, noteTitle } = useNote();

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        toggleCommandOpen();
      }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const fuse = useMemo(
    () => new Fuse(notes, { keys: ["title"], threshold: 0.4 }),
    [notes],
  );

  const recentNotes = useMemo(() => {
    return [...notes].slice(0, 5);
  }, [notes]);

  const visibleNotes = useMemo(() => {
    if (searchValue.trim() === "") {
      return recentNotes;
    }

    const searchResults = fuse.search(searchValue).map((result) => result.item);
    if (searchResults.length === 0) {
      return recentNotes;
    }
    return searchResults;
  }, [searchValue, fuse, recentNotes, notes]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleNewNote = async (title: string = "New Note") => {
    startTransition(() => {
      toast.promise(createNoteAction(title || "New Note"), {
        loading: "Creating note...",
        success: async (data) => {
          const { title, body, errorMessage } = await getDecryptedNoteAction(
            data.note!.id,
          );
          if (errorMessage) {
            throw new Error(errorMessage);
          }
          const note = {
            ...data.note!,
            title,
            body,
          };
          addNote(note);
          return {
            message: "Note created",
            description: "You can now view and edit your new note.",
            action: {
              label: "View Note",
              onClick: () => router.push(`/note/${note.id}`),
            },
          };
        },
        error: (error) => {
          return {
            message: "Note creation failed",
            description: error.message,
          };
        },
      });
    });
    toggleCommandOpen();
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={toggleCommandOpen}>
      <CommandInput
        onValueChange={(e) => handleSearchChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleNewNote(searchValue);
          }
        }}
        value={searchValue}
        placeholder="Search or press Enter to create a new note..."
      />
      <CommandList>
        <CommandGroup
          heading={
            visibleNotes === recentNotes
              ? "Recent Notes"
              : `Search Results (${visibleNotes.length})`
          }
          className="!px-3"
        >
          {visibleNotes.map((note) => (
            <CommandItem
              className="!text-accent-foreground hover:!bg-muted hover:!text-accent-foreground h-9 cursor-pointer !bg-transparent"
              key={note.id}
              asChild
            >
              <Link href={`/note/${note.id}`}>
                {note.id === noteId ? noteTitle : note.title || "New Note"}
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
