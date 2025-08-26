"use client";

import { createNoteAction, getDecryptedNoteAction } from "@/actions/notes";
import useCommandState from "@/hooks/use-command-state";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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

  const [allNotes, setAllNotes] = useState<Note[]>(initialNotes);
  const {
    noteUpdated,
    setNoteUpdated,
    noteTitle,
    noteCreated,
    setNoteCreated,
    noteDeleted,
    setNoteDeleted,
  } = useNote();

  useEffect(() => {
    setAllNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    if (noteUpdated) {
      setNoteUpdated(false);
      setAllNotes((prev) =>
        prev
          .map((n) =>
            n.id === noteId
              ? { ...n, title: noteTitle, updatedAt: new Date() }
              : n,
          )
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
      );
    }
    if (noteCreated) {
      setAllNotes((prev) => [noteCreated, ...prev]);
      setNoteCreated(null);
    }
    if (noteDeleted) {
      setAllNotes((prev) => prev.filter((n) => n.id !== noteDeleted));
      setNoteDeleted(null);
    }
  }, [
    noteUpdated,
    setNoteUpdated,
    noteCreated,
    setNoteCreated,
    noteDeleted,
    setNoteDeleted,
  ]);

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
    () => new Fuse(allNotes, { keys: ["title"], threshold: 0.4 }),
    [allNotes],
  );

  const recentNotes = useMemo(() => {
    return [...allNotes]
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, 5);
  }, [allNotes]);

  const visibleNotes = useMemo(() => {
    if (searchValue.trim() === "") {
      return recentNotes;
    }

    const searchResults = fuse.search(searchValue).map((result) => result.item);
    if (searchResults.length === 0) {
      return recentNotes;
    }
    return searchResults;
  }, [searchValue, fuse, recentNotes, allNotes]);

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
          setNoteCreated(note);
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
              <Link href={`/note/${note.id}`}> {note.title}</Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
