import { Note } from "@prisma/client";
import { useMemo } from "react";

const getNoteGroup = (noteDate: Date): string => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  if (noteDate >= startOfToday) return "Today";

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  if (noteDate >= startOfYesterday) return "Yesterday";

  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6);
  if (noteDate >= startOf7DaysAgo) return "Last 7 Days";

  const startOf30DaysAgo = new Date(startOfToday);
  startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 29);
  if (noteDate >= startOf30DaysAgo) return "Last 30 Days";

  return "Older";
};

type NoteWithBody = Pick<
  Note,
  "id" | "title" | "pinned" | "updatedAt" | "createdAt" | "authorId"
> & { body: string };

export const useGroupedNotes = (notes: NoteWithBody[]) => {
  return useMemo(() => {
    const groups: { [label: string]: NoteWithBody[] } = {
      Pinned: [],
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      "Last 30 Days": [],
      Older: [],
    };

    notes.forEach((note) => {
      if (note.pinned) {
        groups["Pinned"] = [note, ...groups["Pinned"]];
      } else {
        const groupLabel = getNoteGroup(new Date(note.updatedAt));
        groups[groupLabel].push(note);
      }
    });

    for (const label in groups) {
      if (label !== "Pinned") {
        groups[label].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      }
    }

    return groups;
  }, [notes]);
};
