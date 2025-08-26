import { deleteNoteAction } from "@/actions/notes";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  onDisable?: (disabledId: string, disabled: boolean) => void;
};

function DeleteNoteButton({
  noteId,
  noteTitle,
  currentNoteId,
  onDeleted,
  type = "sidebar",
  onDisable,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteNote = async (
    e: React.MouseEvent<HTMLButtonElement>,
    noteId: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    onDisable?.(noteId, true);
    startTransition(() => {
      const promise = new Promise(async (resolve, reject) => {
        const result = await deleteNoteAction(noteId);
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });
      toast.promise(promise, {
        loading: "Deleting note...",
        success: () => {
          onDeleted?.(noteId);
          if (noteId === currentNoteId) {
            router.replace("/");
          }
          onDisable?.(noteId, false);
          return {
            message: "Note deleted",
            description: "You have successfully deleted your note.",
          };
        },
        error: (error) => {
          return {
            message: "Note deletion failed",
            description: "An error occurred while deleting the note.",
          };
        },
      });
    });
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
