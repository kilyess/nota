"use client";

import { createNoteAction } from "@/actions/notes";
import useCommandState from "@/hooks/use-command-state";
import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  isLoggedIn: boolean;
};

export default function CommandMenu({ notes, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { commandOpen, toggleCommandOpen } = useCommandState();
  const router = useRouter();

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
    return [...notes]
      .sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, 5);
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
  }, [searchValue, fuse, recentNotes]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleNewNote = async (title: string = "New Note") => {
    setLoading(true);
    if (!isLoggedIn) {
      toast.warning("Not logged in", {
        description: "Please login or sign up to create a new note.",
      });
      setLoading(false);
      return;
    }

    toast.promise(
      createNoteAction(title || "New Note") as Promise<{
        noteId: string;
        errorMessage: string | null;
      }>,
      {
        loading: "Creating note...",
        success: (data) => {
          if (data.noteId) {
            router.push(`/note/${data.noteId}`);
          }
          setLoading(false);
          return "Note created";
        },
        error: (error) => {
          setLoading(false);
          return error.message;
        },
      },
    );
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
