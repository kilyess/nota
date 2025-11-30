"use client";

import { logOutAction } from "@/actions/users";
import { LogOut } from "lucide-react";
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

function LogOutButton() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    setOpen(false);
    startTransition(() => {
      const promise = new Promise<{
        errorMessage: string | null;
      }>(async (resolve, reject) => {
        const result = await logOutAction();
        if (result.errorMessage) {
          reject(new Error(result.errorMessage));
        } else {
          resolve(result);
        }
      });

      toast.promise(promise, {
        loading: "Logging out...",
        success: () => {
          router.replace("/");
          return {
            message: "Logged out",
            description: "You have been succesfully logged out.",
          };
        },
        error: (error) => {
          return {
            message: "Logout failed",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="size-7"
          disabled={isPending}
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to log in again to
            access your notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogOut}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Log Out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogOutButton;
