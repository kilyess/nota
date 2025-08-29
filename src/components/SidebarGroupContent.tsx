"use client";

import { useGroupedNotes } from "@/hooks/use-grouped-notes";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import { ChevronDown, Pin, PinOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import DeleteNoteButton from "./DeleteNoteButton";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  SidebarGroupContent as SidebarGroupContentBase,
  SidebarGroupLabel,
} from "./ui/sidebar";

type Props = {
  notes: Note[];
  showTopFade: boolean;
  showBottomFade: boolean;
};

function SidebarGroupContent({ notes, showTopFade, showBottomFade }: Props) {
  const { id: currentNoteId } = useParams();
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);
  const [disabledNoteId, setDisabledNoteId] = useState<string[]>([]);
  const { noteTitle, updateNote } = useNote();

  const handlePinClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    note: Note,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    updateNote({ ...note, pinned: !note.pinned });
  };

  const handleDisableNote = (noteId: string, disabled: boolean) => {
    if (disabled) {
      setDisabledNoteId((prev) => [...prev, noteId]);
    } else {
      setDisabledNoteId((prev) => prev.filter((id) => id !== noteId));
    }
  };

  const groupedNotes = useGroupedNotes(notes);

  return (
    <div className="relative">
      <div
        aria-hidden
        className={`from-sidebar pointer-events-none sticky top-0 z-[70] -mt-4 h-3 bg-gradient-to-b to-transparent transition-opacity duration-150 ${showTopFade ? "opacity-100" : "opacity-0"}`}
      />

      {Object.entries(groupedNotes).map(([label, notes]) =>
        notes.length > 0 ? (
          <div key={label}>
            <SidebarGroupLabel>
              {label === "Pinned" ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Pin className="size-3" />
                    <span className="pb-0.5">Pinned</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="size-7 rounded-md p-1.5"
                    onClick={() => setPinnedCollapsed((prev) => !prev)}
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${pinnedCollapsed ? "-rotate-180" : "rotate-0"}`}
                    />
                  </Button>
                </div>
              ) : (
                label
              )}
            </SidebarGroupLabel>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ${label === "Pinned" && pinnedCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
            >
              <SidebarGroupContentBase className="flex flex-col gap-0.5 overflow-hidden px-2">
                {notes.map((note) => (
                  <ContextMenu key={note.id}>
                    <ContextMenuTrigger>
                      <Link
                        className={`group/link relative flex w-full cursor-pointer items-center overflow-hidden rounded-lg px-3 py-2 text-left text-sm font-medium transition ${note.id === currentNoteId ? "bg-sidebar-accent text-accent-foreground" : ""} hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${disabledNoteId.includes(note.id) ? "pointer-events-none opacity-50" : ""}`}
                        href={`/note/${note.id}`}
                      >
                        <div className="w-full truncate">
                          {(note.id === currentNoteId
                            ? noteTitle
                            : note.title) || "New Note"}
                        </div>
                        <div className="text-muted-foreground group-hover/link:bg-sidebar-accent pointer-events-none absolute top-0 right-1 bottom-0 z-50 flex items-center justify-end opacity-0 transition-opacity group-hover/link:pointer-events-auto group-hover/link:opacity-100">
                          <div className="from-sidebar-accent pointer-events-none absolute top-0 right-full h-full w-8 bg-gradient-to-l to-transparent group-hover/link:opacity-100"></div>
                          <Button
                            variant="ghost"
                            className="size-7 rounded-md p-1.5"
                            onClick={(e) => handlePinClick(e, note)}
                            title={note.pinned ? "Unpin" : "Pin"}
                          >
                            {note.pinned ? (
                              <PinOff className="size-4" />
                            ) : (
                              <Pin className="size-4" />
                            )}
                          </Button>
                          <DeleteNoteButton
                            noteId={note.id}
                            currentNoteId={currentNoteId as string}
                            noteTitle={note.title}
                            onDisable={handleDisableNote}
                          />
                        </div>
                      </Link>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onClick={(e) => handlePinClick(e, note)}>
                        {note.pinned ? (
                          <PinOff className="text-accent-foreground mr-2 size-4" />
                        ) : (
                          <Pin className="text-accent-foreground mr-2 size-4" />
                        )}
                        <span>{note.pinned ? "Unpin" : "Pin"}</span>
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <DeleteNoteButton
                          noteId={note.id}
                          currentNoteId={currentNoteId as string}
                          noteTitle={note.title}
                          type="context-menu"
                          onDisable={handleDisableNote}
                        />
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </SidebarGroupContentBase>
            </div>
          </div>
        ) : null,
      )}

      <div
        aria-hidden
        className={`from-sidebar pointer-events-none sticky bottom-0 z-[70] -mb-4 h-3 bg-gradient-to-t to-transparent transition-opacity duration-150 ${showBottomFade ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default SidebarGroupContent;
