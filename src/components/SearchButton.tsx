"use client";

import { Button } from "@/components/ui/button";
import useCommandState from "@/hooks/use-command-state";
import { Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function SearchButton() {
  const { setCommandOpen } = useCommandState();

  const handleCommand = () => {
    setCommandOpen(true);
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="focus-visible:!ring-ring !text-foreground focus-visible:!border-ring hover:!text-accent-foreground flex !h-10 !w-40 !shrink-0 !gap-2 !rounded-full !border !font-semibold !shadow !outline-1 !backdrop-blur-xl !transition-colors !outline-none"
          onClick={handleCommand}
        >
          <Search />
          Search
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center gap-2">
          <kbd className="bg-ring/30 flex items-center gap-2 rounded-sm px-1 py-0.5 text-xs">
            <span>⌘</span>
            <span>K</span>
          </kbd>
          or
          <kbd className="bg-ring/30 flex items-center gap-2 rounded-sm px-1 py-0.5 text-xs">
            <span>Ctrl</span>
            <span>K</span>
          </kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default SearchButton;
