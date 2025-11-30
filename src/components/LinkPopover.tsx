"use client";

import { Editor } from "@tiptap/react";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  editor: Editor | null;
};

export function LinkPopover({ editor }: Props) {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && editor) {
      const currentUrl = editor.getAttributes("link").href || "";
      setUrl(currentUrl);
    }
  }, [isOpen, editor]);

  const setLink = () => {
    if (!editor) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsOpen(false);
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();

    setIsOpen(false);
    setUrl("");
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
    setUrl("");
  };

  if (!editor) return null;

  const isActive = editor.isActive("link");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`hover:!bg-muted hover:!text-muted-foreground cursor-pointer ${isActive ? "bg-accent hover:!bg-accent hover:!text-accent-foreground" : ""}`}
          onClick={() => setIsOpen(true)}
        >
          <Link className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Add Link</h4>
            <p className="text-muted-foreground text-sm">
              Enter the URL for the link
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
                if (e.key === "Escape") {
                  setIsOpen(false);
                }
              }}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={setLink} size="sm" className="flex-1">
              {isActive ? "Update" : "Add"} Link
            </Button>
            {isActive && (
              <Button
                onClick={removeLink}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
