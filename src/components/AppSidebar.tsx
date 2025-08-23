"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Note, User } from "@prisma/client";
import Fuse from "fuse.js";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  notes,
  user,
  isLoggedIn,
  ...props
}: React.ComponentProps<typeof Sidebar> & Props) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
  const [value, setValue] = useState("");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(filteredNotes, {
      keys: ["title"],
      threshold: 0.4,
    });
  }, [filteredNotes]);

  const handleSearch = (search: string) => {
    if (search.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = fuse.search(search);
      setFilteredNotes(filtered.map((result) => result.item));
    }
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
              role="searchbox"
              aria-label="Search notes"
              placeholder="Search your notes..."
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                setValue(v);
                handleSearch(v);
                setHidden(v === "");
              }}
            />
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-muted/40 ml-2 size-6 rounded-md p-1"
              onClick={() => {
                setValue("");
                handleSearch("");
                setHidden(true);
              }}
              hidden={hidden}
              aria-label="Clear search"
            >
              <XIcon />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent notes={filteredNotes} />
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
