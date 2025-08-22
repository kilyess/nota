"use client";

import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import SidebarGroupContent from "./SidebarGroupContent";

type Props = {
  notes: Note[];
};

function SidebarContentWrapper({ notes }: Props) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);

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
    <>
      <div className="border-sidebar-ring-accent mx-1 border-b px-2 max-sm:mx-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      <SidebarGroupContent notes={filteredNotes} />
    </>
  );
}

export default SidebarContentWrapper;
