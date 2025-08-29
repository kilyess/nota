"use client";

import { createNoteAction, getDecryptedNoteAction } from "@/actions/notes";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import { Notebook } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  type: "home" | "sidebar";
};

function NewNoteButton({ type }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { addNote } = useNote();
  const handleNewNote = async () => {
    startTransition(() => {
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
    <>
      {type === "home" ? (
        <Button
          onClick={handleNewNote}
          variant="outline"
          className="focus-visible:!ring-ring !text-foreground focus-visible:!border-ring hover:!text-accent-foreground flex !h-10 !w-40 !shrink-0 !gap-2 !rounded-full !border !font-semibold !shadow !outline-1 !backdrop-blur-xl !transition-colors !outline-none"
          disabled={isPending}
        >
          <Notebook />
          New Note
        </Button>
      ) : (
        <Button
          onClick={handleNewNote}
          className="w-[14rem] self-center font-bold max-sm:py-3 max-sm:text-base"
          disabled={isPending}
        >
          New Note
        </Button>
      )}
    </>
  );
}

export default NewNoteButton;
