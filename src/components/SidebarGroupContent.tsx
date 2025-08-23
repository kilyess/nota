"use client";

import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import { Pin, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DeleteNoteButton from "./DeleteNoteButton";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { SidebarGroupLabel } from "./ui/sidebar";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const { id } = useParams();

  const { noteTitle, noteUpdatedAt } = useNote();
  const [groupedNotes, setGroupedNotes] = useState<{ [label: string]: Note[] }>(
    {
      Pinned: [],
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
      Older: [],
    },
  );
  const [visibleNotes, setVisibleNotes] = useState<Note[]>(notes);
  const scrollRef = useRef<HTMLElement | null>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    setVisibleNotes(notes);
  }, [notes]);

  // Manage top/bottom gradient visibility based on scroll position
  useEffect(() => {
    const el = (document.querySelector(
      '[data-slot="sidebar-content"]',
    ) as HTMLElement | null)!;
    scrollRef.current = el;
    if (!el) return;

    const update = () => {
      const atTop = el.scrollTop <= 0;
      const atBottom =
        Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
      setShowTopFade(!atTop);
      setShowBottomFade(!atBottom);
    };

    update();
    el.addEventListener("scroll", update, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update as unknown as EventListener);
      window.removeEventListener("resize", update);
    };
  }, [groupedNotes]);

  useEffect(() => {
    if (!id) return;
    setVisibleNotes((prev) =>
      prev.map((n) =>
        n.id === (id as string)
          ? {
              ...n,
              title: noteTitle ?? n.title,
              updatedAt: noteUpdatedAt ?? n.updatedAt,
            }
          : n,
      ),
    );
  }, [id, noteTitle, noteUpdatedAt]);

  useEffect(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
    const startOf30DaysAgo = new Date(startOfToday);
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 29);

    const newGroups: { [label: string]: Note[] } = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
      Older: [],
    };

    visibleNotes.forEach((note) => {
      const updatedAt = new Date(note.updatedAt);

      if (updatedAt >= startOfToday) {
        newGroups["Today"].push(note);
      } else if (updatedAt >= startOfYesterday && updatedAt < startOfToday) {
        newGroups["Yesterday"].push(note);
      } else if (updatedAt >= startOf7DaysAgo && updatedAt < startOfYesterday) {
        newGroups["Last 7 Days"].push(note);
      } else if (updatedAt >= startOf30DaysAgo && updatedAt < startOf7DaysAgo) {
        newGroups["Last 30 Days"].push(note);
      } else {
        newGroups["Older"].push(note);
      }
    });

    Object.keys(newGroups).forEach((label) => {
      newGroups[label].sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
    });

    setGroupedNotes(newGroups);
  }, [visibleNotes, noteTitle, noteUpdatedAt, id]);

  const handleDeleted = (deletedId: string) => {
    setVisibleNotes((prev) => prev.filter((n) => n.id !== deletedId));
  };

  return (
    <div className="relative">
      <div
        aria-hidden
        className={`from-sidebar pointer-events-none sticky top-0 z-[70] -mt-4 h-5 bg-gradient-to-b to-transparent transition-opacity duration-150 ${showTopFade ? "opacity-100" : "opacity-0"}`}
      />
      {Object.entries(groupedNotes).map(([label, groupNotes]) =>
        groupNotes.length > 0 ? (
          <div key={label}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <div className="flex flex-col gap-0.5 px-2">
              {groupNotes.map((note) => (
                <ContextMenu key={note.id}>
                  <ContextMenuTrigger>
                    <Link
                      className={`group/link relative flex w-full cursor-pointer items-center overflow-hidden rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                        note.id === id
                          ? "bg-sidebar-accent text-accent-foreground"
                          : ""
                      } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                      href={`/note/${note.id}`}
                    >
                      <div className="w-full truncate">
                        {(note.id === id ? noteTitle : note.title) ||
                          "New Note"}
                      </div>
                      <div className="text-muted-foreground group-hover/link:bg-sidebar-accent pointer-events-none absolute top-0 right-1 bottom-0 z-50 flex items-center justify-end opacity-0 transition-opacity delay-0 duration-200 group-hover/link:pointer-events-auto group-hover/link:opacity-100">
                        <div className="from-sidebar-accent pointer-events-none absolute top-0 right-[100%] bottom-0 h-full w-8 bg-gradient-to-l to-transparent opacity-0 transition-opacity delay-0 duration-200 group-hover/link:opacity-100"></div>
                        <Button
                          variant="ghost"
                          className="size-7 rounded-md p-1.5"
                        >
                          <Pin className="size-4" />
                        </Button>
                        <DeleteNoteButton
                          noteId={note.id}
                          currentNoteId={id as string}
                          noteTitle={note.title}
                          onDeleted={handleDeleted}
                        />
                      </div>
                    </Link>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>
                      <Pin className="text-accent-foreground size-4" />
                      Pin
                    </ContextMenuItem>
                    <ContextMenuItem>
                      <DeleteNoteButton
                        noteId={note.id}
                        currentNoteId={id as string}
                        noteTitle={note.title}
                        onDeleted={handleDeleted}
                        type="context-menu"
                      />
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </div>
        ) : null,
      )}
      <div
        aria-hidden
        className={`from-sidebar pointer-events-none sticky bottom-0 z-[70] -mb-4 h-5 bg-gradient-to-t to-transparent transition-opacity duration-150 ${showBottomFade ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default SidebarGroupContent;
