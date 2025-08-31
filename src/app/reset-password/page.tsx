"use client";

import { resetPasswordAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionHandler } from "@/hooks/use-action-handler";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(
    "loading",
  );

  const { handler: resetPassword, isPending: isResettingPassword } =
    useActionHandler(resetPasswordAction);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setStatus("valid");
        subscription.unsubscribe();
      } else {
        setStatus("invalid");
        subscription.unsubscribe();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    resetPassword(
      {
        onSuccess: () => {
          router.replace("/login");
        },
        loadingMessage: "Resetting password...",
        successMessage: "Password updated successfully!",
        successDescription: "You can now log in with your new password.",
        errorMessage: "Failed to reset password",
      },
      password,
    );
  };

  if (status === "loading") {
    return (
      <div className="mt-20 flex flex-1 flex-col items-center justify-center">
        <Loader2 className="text-muted-foreground h-10 w-10 animate-spin" />
        <p className="text-muted-foreground mt-4">Verifying link...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="mt-20 flex flex-1 flex-col items-center max-sm:mx-auto max-sm:max-w-sm">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive text-center text-2xl">
              Invalid Link
            </CardTitle>
            <CardDescription className="text-center">
              This password reset link is either invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request a New Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <form action={handleResetPassword}>
      <div className="mt-20 flex flex-1 flex-col items-center max-sm:mx-auto max-sm:max-w-sm">
        <Card className="w-full max-w-md">
          <CardHeader className="mb-1">
            <CardTitle className="text-center text-3xl">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isResettingPassword}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isResettingPassword}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center">
            <Button
              type="submit"
              disabled={isResettingPassword}
              className="w-full"
            >
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
