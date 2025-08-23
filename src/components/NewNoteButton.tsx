"use client";

import { createNoteAction } from "@/actions/notes";
import { Loader2, Notebook } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Props = {
  isLoggedIn: boolean;
  type: "home" | "sidebar";
};

function NewNoteButton({ isLoggedIn, type }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNewNote = async () => {
    setLoading(true);
    if (!isLoggedIn) {
      toast.warning("Not logged in", {
        description: "Please login or sign up to create a new note.",
      });
      setLoading(false);
      return;
    }

    const note = (await createNoteAction()) as {
      noteId: string;
      errorMessage: string | null;
    };

    if (note.errorMessage) {
      toast.error(note.errorMessage);
      setLoading(false);
      return;
    }

    toast.success("Note created", {
      description: "You can now start writing your note.",
    });

    if (note.noteId) {
      router.push(`/note/${note.noteId}`);
    }

    setLoading(false);
  };

  return (
    <>
      {type === "home" ? (
        <Button
          onClick={handleNewNote}
          variant="outline"
          className="focus-visible:!ring-ring !text-foreground focus-visible:!border-ring hover:!text-accent-foreground flex !h-10 !w-40 !shrink-0 !gap-2 !rounded-full !border !font-semibold !shadow !outline-1 !backdrop-blur-xl !transition-colors !outline-none"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Notebook />
              New Note
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleNewNote}
          className="w-[14rem] self-center font-bold max-sm:py-3 max-sm:text-base"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "New Note"}
        </Button>
      )}
    </>
  );
}

export default NewNoteButton;
