import { deleteNoteAction } from "@/actions/notes";
import { useActionHandler } from "@/hooks/use-action-handler";
import useNote from "@/hooks/use-note";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type Props = {
  noteId: string;
  noteTitle: string;
  currentNoteId: string;
  type?: "sidebar" | "context-menu";
  onDisable?: (disabledId: string, disabled: boolean) => void;
};

function DeleteNoteButton({
  noteId,
  noteTitle,
  currentNoteId,
  type = "sidebar",
  onDisable,
}: Props) {
  const [open, setOpen] = useState(false);
  const { handler: handlerDeleteNote, isPending: isDeletingNote } =
    useActionHandler(deleteNoteAction);
  const { deleteNote, notes } = useNote();
  const router = useRouter();

  const handleDeleteNote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    noteId: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onDisable?.(noteId, true);
    handlerDeleteNote(
      {
        onSuccess: () => {
          const note = notes.find((note) => note.id === noteId);
          if (note) {
            deleteNote(note);
          }
          if (noteId === currentNoteId) {
            router.replace("/app");
          }
          onDisable?.(noteId, false);
        },
        loadingMessage: "Deleting note...",
        successMessage: "Note deleted successfully",
        successDescription: "Your note has been deleted successfully.",
        errorMessage: "Failed to delete note",
        errorDescription: "Please try again later.",
      },
      noteId,
    );
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {type === "sidebar" ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
            tabIndex={-1}
            variant="ghost"
            className="hover:bg-destructive/50! hover:text-destructive-foreground! z-50 size-7 rounded-md p-1.5"
            aria-label="Delete note"
          >
            <Trash className="size-4" />
          </Button>
        ) : (
          <div
            className="flex w-full cursor-default items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
          >
            <Trash className="text-accent-foreground size-4" />
            <span className="text-accent-foreground">Delete</span>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">Delete Note</AlertDialogTitle>
          <AlertDialogDescription className="font-semibold">
            Are you sure you want to delete &quot;{noteTitle || "New Note"}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="font-bold"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-bold"
            onClick={(e) => handleDeleteNote(e, noteId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteNoteButton;
