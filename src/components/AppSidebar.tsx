"use client";

import { togglePinNoteAction } from "@/actions/notes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import useNote from "@/hooks/use-note";
import { useGroupedNotes } from "@/hooks/useGroupedNotes";
import { Note, User } from "@prisma/client";
import Fuse from "fuse.js";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { NavUser } from "./NavUser";
import NewNoteButton from "./NewNoteButton";
import SidebarGroupContent from "./SidebarGroupContent";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  notes: Note[];
  user: User | null;
  isLoggedIn: boolean;
};

function AppSidebar({
  notes: initialNotes,
  user,
  isLoggedIn,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  const { id: currentNoteId } = useParams();
  const { noteTitle, noteUpdatedAt } = useNote();

  // The single source of truth for all notes on the client
  const [allNotes, setAllNotes] = useState<Note[]>(initialNotes);
  const [searchValue, setSearchValue] = useState("");

  // Update internal state if the initial server-provided notes change
  useEffect(() => {
    setAllNotes(initialNotes);
  }, [initialNotes]);

  // If the active note is being edited, reflect its title/date changes in the sidebar list
  useEffect(() => {
    if (currentNoteId && (noteTitle != null || noteUpdatedAt != null)) {
      setAllNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === currentNoteId
            ? {
                ...n,
                title: noteTitle ?? n.title,
                updatedAt: noteUpdatedAt ?? n.updatedAt,
              }
            : n,
        ),
      );
    }
  }, [currentNoteId, noteTitle, noteUpdatedAt]);

  // Memoize the Fuse instance
  const fuse = useMemo(
    () => new Fuse(allNotes, { keys: ["title"], threshold: 0.4 }),
    [allNotes],
  );

  // Derive filtered notes from the search value and master list
  const filteredNotes = useMemo(() => {
    if (searchValue.trim() === "") {
      return allNotes;
    }
    return fuse.search(searchValue).map((result) => result.item);
  }, [allNotes, searchValue, fuse]);

  // Derive grouped notes from the filtered list using our custom hook
  const groupedNotes = useGroupedNotes(filteredNotes);

  const handleNoteDeleted = (deletedId: string) => {
    setAllNotes((prev) => prev.filter((n) => n.id !== deletedId));
  };

  const handleNotePinned = useCallback(
    async (noteId: string, newPinnedState: boolean) => {
      // Optimistic UI update
      const originalNotes = allNotes;
      setAllNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, pinned: newPinnedState } : n,
        ),
      );

      const res = await togglePinNoteAction(noteId, newPinnedState);
      if (res.errorMessage) {
        toast.error(res.errorMessage);
        setAllNotes(originalNotes); // Revert on failure
      }
    },
    [allNotes],
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex h-36 w-full flex-col items-center justify-center gap-2.5">
        <Link href="/">
          <h1 className="text-2xl font-semibold">nota</h1>
        </Link>
        <NewNoteButton isLoggedIn={isLoggedIn} type="sidebar" />
        <div className="border-sidebar-ring-accent border-b px-2">
          <div className="flex items-center">
            <SearchIcon className="size-4 min-w-4" />
            <Input
              className="!text-foreground placeholder:!text-muted-foreground/50 !w-full !border-none !bg-transparent py-2 !text-sm font-semibold placeholder:select-none focus:!ring-0"
              placeholder="Search your notes..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchValue && (
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-muted/40 ml-2 size-6 rounded-md p-1"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <XIcon />
              </Button>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent
          groupedNotes={groupedNotes}
          onDeleted={handleNoteDeleted}
          onPinned={handleNotePinned}
        />
      </SidebarContent>
      <SidebarFooter>
        {isLoggedIn ? (
          <NavUser user={user as User} />
        ) : (
          <>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
