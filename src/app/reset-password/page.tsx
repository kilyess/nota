"use client";

import { resetPasswordAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionHandler } from "@/hooks/use-action-handler";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          router.replace("/reset-password/confirm");
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
      <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
        <div className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <h1 className="text-destructive mb-4 text-xl font-semibold">
                Invalid Link
              </h1>
              <p className="text-muted-foreground text-sm">
                This password reset link is either invalid or has expired.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a New Link</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
      <form
        action={handleResetPassword}
        className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/favicon.ico"
                width={32}
                height={32}
                alt="nota"
                style={{ display: "inline-block" }}
              />
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">Reset Password</h1>
            <p className="text-sm">Please enter your new password below</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isResettingPassword}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full p-1.5 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isResettingPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isResettingPassword}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full p-1.5 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isResettingPassword}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isResettingPassword}
              className="w-full"
            >
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
