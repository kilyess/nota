"use client";

import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import useNote from "@/hooks/use-note";
import { useScrollFade } from "@/hooks/use-scroll-fade";
import { Note, User } from "@prisma/client";
import Fuse from "fuse.js";
import { SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavUser } from "./NavUser";
import NewNoteButton from "./NewNoteButton";
import SidebarGroupContent from "./SidebarGroupContent";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSidebar } from "./ui/sidebar";
type NoteWithBody = Pick<
  Note,
  "id" | "title" | "pinned" | "updatedAt" | "createdAt" | "authorId"
> & { body: string };

type Props = {
  notes: NoteWithBody[];
  user: User | null;
  isLoggedIn: boolean;
};

function AppSidebar({
  notes: initialNotes,
  user,
  isLoggedIn,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { notes, setNotes } = useNote();
  const [searchValue, setSearchValue] = useState("");
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const { showTopFade, showBottomFade } = useScrollFade(
    sidebarContentRef as React.RefObject<HTMLElement>,
  );
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes, setNotes]);

  const fuse = useMemo(
    () => new Fuse(notes, { keys: ["title"], threshold: 0.4 }),
    [notes],
  );

  const filteredNotes = useMemo(() => {
    if (searchValue.trim() === "") {
      return notes;
    }

    const searchResults = fuse.search(searchValue).map((result) => result.item);
    return searchResults;
  }, [searchValue, fuse, notes]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex h-36 w-full flex-col items-center justify-center gap-4 pt-5">
        <Link
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
          href="/"
        >
          <span className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              width={24}
              height={24}
              alt="nota"
              className="h-6 w-6"
            />
            <Logo className="h-3 w-auto" />
          </span>
        </Link>
        <NewNoteButton type="sidebar" />
        <div className="border-sidebar-ring-accent w-full border-b px-2">
          <div className="flex items-center">
            <SearchIcon className="size-4 min-w-4" />
            <Input
              className="text-foreground! placeholder:text-muted-foreground/50! w-full! border-none! bg-transparent! py-2 text-sm! font-semibold placeholder:select-none focus:ring-0!"
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
      <SidebarContent ref={sidebarContentRef}>
        <SidebarGroupContent
          notes={filteredNotes}
          showTopFade={showTopFade}
          showBottomFade={showBottomFade}
        />
      </SidebarContent>
      <SidebarFooter>
        {isLoggedIn ? (
          <NavUser user={user as User} notes={notes} />
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
