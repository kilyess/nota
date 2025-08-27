"use client";

import { logOutAction } from "@/actions/users";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

function LogOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogOut = async () => {
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
          router.replace("/login");
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
    <Button
      variant="ghost"
      className="size-7"
      onClick={handleLogOut}
      disabled={isPending}
    >
      <LogOut className="size-4" />
    </Button>
  );
}

export default LogOutButton;
