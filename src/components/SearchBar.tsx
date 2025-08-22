"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  onSearch: (search: string) => void;
};

function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex items-center">
      <SearchIcon className="size-4 min-w-4" />
      <Input
        className="!text-foreground placeholder:!text-muted-foreground/50 !w-full !border-none !bg-transparent py-2 !text-sm font-medium placeholder:select-none focus:!ring-0"
        role="searchbox"
        aria-label="Search notes"
        placeholder="Search your notes..."
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          onSearch(v);
          setHidden(v === "");
        }}
      />
      <Button
        variant="ghost"
        className="text-muted-foreground hover:bg-muted/40 ml-2 size-6 rounded-md p-1"
        onClick={() => {
          setValue("");
          onSearch("");
          setHidden(true);
        }}
        hidden={hidden}
        aria-label="Clear search"
      >
        <XIcon />
      </Button>
    </div>
  );
}

export default SearchBar;
