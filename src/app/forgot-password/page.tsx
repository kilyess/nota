"use client";

import { sendResetPasswordEmailAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;

      const promise = new Promise<{ errorMessage: string | null }>(
        async (resolve, reject) => {
          const result = await sendResetPasswordEmailAction(email);
          if (result.errorMessage) {
            reject(new Error(result.errorMessage));
          } else {
            resolve(result);
          }
        },
      );
      toast.promise(promise, {
        loading: "Sending reset link...",
        success: () => {
          router.replace("/");
          return {
            message: "Email sent",
            description: "Check your email for the password reset link.",
          };
        },
        error: (error) => {
          return {
            message: "Failed to send email",
            description: error.message,
          };
        },
      });
    });
  };

  return (
    <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
      <form
        action={handleSubmit}
        className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/favicon.ico"
                width={48}
                height={48}
                alt="nota"
                style={{ display: "inline-block" }}
              />
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Recover Password
            </h1>
            <p className="text-sm">Enter your email to receive a reset link</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="name@example.com"
              />
            </div>

            <Button className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              We'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Remembered your password?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}

export default ForgotPasswordPage;
