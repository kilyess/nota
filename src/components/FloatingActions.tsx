"use client";

import { createNoteAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Note } from "@prisma/client";
import clsx from "clsx";
import Fuse from "fuse.js";
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

type Props = {
  notes: Note[];
  isLoggedIn: boolean;
};

export default function FloatingActions({ notes, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setOpen(window.innerWidth < 768);
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        setCommandOpen((s) => !s);
      }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [isMobile]);

  const fuse = useMemo(
    () => new Fuse(notes, { keys: ["title"], threshold: 0.4 }),
    [notes],
  );

  const visibleNotes = useMemo(() => {
    if (searchValue.trim() === "") {
      return [];
    }
    return fuse.search(searchValue).map((result) => result.item);
  }, [notes, searchValue, fuse]);

  const handleToggle = () => {
    if (!isMobile) {
      setOpen((s) => !s);
    }
  };

  const handleCommand = () => {
    setCommandOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleNewNote = async (title: string = "New Note") => {
    setLoading(true);
    setCommandOpen(true);
    if (!isLoggedIn) {
      toast.warning("Not logged in", {
        description: "Please login or sign up to create a new note.",
      });
      setLoading(false);
      return;
    }

    toast.promise(
      createNoteAction(title) as Promise<{
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
    setCommandOpen(false);
  };

  return (
    <>
      <div
        className={clsx(
          "pointer-events-none fixed top-4 left-4 z-30 rounded-lg p-1 transition-colors",
          "flex items-center space-x-1",
          open ? "bg-sidebar/50 backdrop-blur-sm" : "bg-transparent ring-0",
        )}
      >
        <div
          onClick={handleToggle}
          aria-expanded={open}
          aria-label={open ? "Close actions" : "Open actions"}
          className="pointer-events-auto transition-transform duration-200 ease-in-out"
        >
          <SidebarTrigger className="size-8" />
        </div>

        <div className="flex items-center">
          <div
            className={clsx(
              "pointer-events-auto origin-left transform transition-all duration-300 ease-in-out",
              open
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-2 opacity-0",
            )}
            style={{ transitionDelay: open ? "75ms" : "0ms" }}
          >
            <Button
              onClick={handleCommand}
              variant="ghost"
              size="sm"
              aria-hidden={!open}
            >
              <SearchIcon />
            </Button>
          </div>

          <div
            className={clsx(
              "pointer-events-auto origin-left transform transition-all duration-300 ease-in-out",
              open
                ? "translate-x-0 opacity-100"
                : "pointer-events-none -translate-x-2 opacity-0",
            )}
            style={{ transitionDelay: open ? "150ms" : "0ms" }}
          >
            <Button
              disabled={loading}
              onClick={() => handleNewNote()}
              variant="ghost"
              size="sm"
              aria-hidden={!open}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
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
          <CommandEmpty>No notes found.</CommandEmpty>
          <CommandGroup className="!px-3">
            {visibleNotes.map((note) => (
              <Link href={`/note/${note.id}`} key={note.id}>
                <CommandItem className="!text-accent-foreground hover:!bg-muted hover:!text-accent-foreground h-9 cursor-pointer !bg-transparent">
                  {note.title}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
