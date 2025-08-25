"use client";

import { Button } from "@/components/ui/button";
import useCommandState from "@/hooks/use-command-state";
import { Search } from "lucide-react";

function SearchButton() {
  const { setCommandOpen } = useCommandState();

  const handleCommand = () => {
    setCommandOpen(true);
  };
  return (
    <Button
      variant="outline"
      className="focus-visible:!ring-ring !text-foreground focus-visible:!border-ring hover:!text-accent-foreground flex !h-10 !w-40 !shrink-0 !gap-2 !rounded-full !border !font-semibold !shadow !outline-1 !backdrop-blur-xl !transition-colors !outline-none"
      onClick={handleCommand}
    >
      <Search />
      Search
    </Button>
  );
}

export default SearchButton;
