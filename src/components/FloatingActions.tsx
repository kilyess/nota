"use client";

import { createNoteAction, getDecryptedNoteAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCommandState from "@/hooks/use-command-state";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import clsx from "clsx";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setCommandOpen } = useCommandState();
  const router = useRouter();
  const { addNote } = useNote();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const checkMobile = () => {
      setOpen(window.innerWidth < 768);
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = () => {
    if (!isMobile) {
      setOpen((s) => !s);
    }
  };

  const handleCommand = () => {
    setCommandOpen(true);
  };

  const handleNewNote = async () => {
    startTransition(async () => {
      const promise = new Promise<{
        note: Note | null;
        errorMessage: string | null;
      }>(async (resolve, reject) => {
        const result = await createNoteAction();
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });

      toast.promise(promise, {
        loading: "Creating new note...",
        success: async (data) => {
          const { title, body, errorMessage } = await getDecryptedNoteAction(
            data.note!.id,
          );
          if (errorMessage) {
            throw new Error(errorMessage);
          }
          const note = {
            ...data.note!,
            title,
            body,
          };
          addNote(note);
          return {
            message: "Note created",
            description: "You can now view and edit your new note.",
            action: {
              label: "View Note",
              onClick: () => router.push(`/note/${note.id}`),
            },
          };
        },
        error: (error) => {
          return {
            message: "Note creation failed",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <div
      className={clsx(
        "pointer-events-none fixed top-4 left-4 z-30 rounded-lg p-1 transition-colors",
        "flex items-center space-x-1",
        open ? "bg-sidebar/50 backdrop-blur-sm" : "bg-transparent ring-0",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleToggle}
            aria-expanded={open}
            aria-label={open ? "Close actions" : "Open actions"}
            className="pointer-events-auto transition-transform duration-200 ease-in-out"
          >
            <SidebarTrigger className="size-8" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <kbd className="bg-ring/30 flex items-center gap-2 rounded-sm px-1 py-0.5 text-xs">
              <span>⌘</span>
              <span>\</span>
            </kbd>
            or
            <kbd className="bg-ring/30 flex items-center gap-2 rounded-sm px-1 py-0.5 text-xs">
              <span>Ctrl</span>
              <span>\</span>
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

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
            disabled={isPending}
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
  );
}
