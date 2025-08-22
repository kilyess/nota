"use client";

import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import { SidebarGroupLabel } from "./ui/sidebar";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const { id } = useParams();
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

  const { noteTitle } = useNote();

  const groups: { [label: string]: Note[] } = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    "Last 30 Days": [],
    Older: [],
  };

  notes.forEach((note) => {
    const updatedAt = new Date(note.updatedAt);
    if (updatedAt >= startOfToday) {
      groups["Today"].push(note);
    } else if (updatedAt >= startOfYesterday && updatedAt < startOfToday) {
      groups["Yesterday"].push(note);
    } else if (updatedAt >= startOf7DaysAgo && updatedAt < startOfYesterday) {
      groups["Last 7 Days"].push(note);
    } else if (updatedAt >= startOf30DaysAgo && updatedAt < startOf7DaysAgo) {
      groups["Last 30 Days"].push(note);
    } else {
      groups["Older"].push(note);
    }
  });

  return (
    <div>
      {Object.entries(groups).map(([label, groupNotes]) =>
        groupNotes.length > 0 ? (
          <div key={label}>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <div className="flex flex-col gap-0.5 px-2">
              {groupNotes.map((note) => (
                <Button
                  key={note.id}
                  variant="ghost"
                  asChild
                  className={`w-full cursor-pointer px-3 text-left text-sm font-medium ${
                    note.id === id
                      ? "bg-accent dark:bg-accent/50 text-accent-foreground"
                      : ""
                  }`}
                >
                  <Link href={`/note/${note.id}`}>
                    <div className="w-full truncate">
                      {(note.id === id ? noteTitle : note.title) || "New Note"}
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

export default SidebarGroupContent;
