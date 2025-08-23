import { deleteNoteAction } from "@/actions/notes";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
  onDeleted?: (deletedId: string) => void;
  type?: "sidebar" | "context-menu";
};

function DeleteNoteButton({
  noteId,
  noteTitle,
  currentNoteId,
  onDeleted,
  type = "sidebar",
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDeleteNote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    noteId: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
    const result = await deleteNoteAction(noteId);
    if (result.errorMessage) {
      toast.error(result.errorMessage);
    } else {
      toast.success("Note deleted successfully");
      onDeleted?.(noteId);
    }
    setIsDeleting(false);

    if (noteId === currentNoteId) {
      router.replace("/");
    }
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
            className="hover:!bg-destructive/50 hover:!text-destructive-foreground z-50 size-7 rounded-md p-1.5"
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
            disabled={isDeleting}
            className="font-bold"
            onClick={(e) => handleDeleteNote(e, noteId)}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteNoteButton;
