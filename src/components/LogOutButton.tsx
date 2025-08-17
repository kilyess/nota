"use client";

import { logOutAction } from "@/actions/users";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogOut = async () => {
    setLoading(true);

    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
      toast.success("Logged Out", {
        description: "You have been succesfully logged out.",
      });
      router.push("/");
    } else {
      toast.error("Error", {
        description: errorMessage,
      });
    }

    setLoading(false);
  };

  return (
    <div
      className="inline-flex w-full items-center gap-2"
      onClick={handleLogOut}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <LogOut />
          Log out
        </>
      )}
    </div>
  );
}

export default LogOutButton;
