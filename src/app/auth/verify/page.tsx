"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, KeyRound, Loader2, Mail, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token_hash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const isRecovery = typeParam === "recovery";
  const isEmailConfirmation = typeParam === "signup" || typeParam === "email";

  // Set default next URL based on type if not provided
  const next =
    searchParams.get("next") ?? (isRecovery ? "/reset-password" : "/login");

  const handleVerify = () => {
    if (!token_hash || !typeParam) {
      setErrorMessage("Invalid verification link.");
      return;
    }

    // Build the redirect URL to the route handler
    const params = new URLSearchParams({
      token_hash,
      type: typeParam,
      next,
    });

    // Redirect to the server route that handles verification
    router.push(`/auth/confirm?${params.toString()}`);
  };

  if (!token_hash || !typeParam) {
    return (
      <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
        <div className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link
                href="/"
                aria-label="go home"
                className="mx-auto block w-fit"
              >
                <Image
                  src="/favicon.ico"
                  width={48}
                  height={48}
                  alt="nota"
                  style={{ display: "inline-block" }}
                />
              </Link>
              <div className="mt-6 flex justify-center">
                <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
                  <XCircle className="text-destructive size-8" />
                </div>
              </div>
              <h1 className="mt-6 mb-2 text-xl font-semibold">Invalid Link</h1>
              <p className="text-muted-foreground text-sm">
                This verification link is missing required parameters.
              </p>
              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
      <div className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5">
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
            <div className="mt-6 flex justify-center">
              {errorMessage ? (
                <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
                  <XCircle className="text-destructive size-8" />
                </div>
              ) : (
                <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                  {isRecovery ? (
                    <KeyRound className="text-primary size-8" />
                  ) : (
                    <Mail className="text-primary size-8" />
                  )}
                </div>
              )}
            </div>
            <h1 className="mt-6 mb-2 text-xl font-semibold">
              {errorMessage
                ? "Invalid Link"
                : isRecovery
                  ? "Reset Your Password"
                  : "Verify Your Email"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {errorMessage
                ? errorMessage
                : isRecovery
                  ? "Click the button below to reset your password. You will be redirected to a page where you can enter your new password."
                  : "Click the button below to verify your email address."}
            </p>
            {errorMessage && (
              <div className="mt-6 space-y-4">
                <div className="bg-muted rounded-lg p-4 text-left">
                  <p className="text-muted-foreground text-xs font-medium">
                    What can you do?
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                    <li>
                      • Request a new{" "}
                      {isRecovery
                        ? "password reset link"
                        : "verification email"}
                    </li>
                    <li>• Check if the link has expired</li>
                    <li>• Make sure you're using the latest link</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            {errorMessage ? (
              <div className="space-y-2">
                {!isRecovery && (
                  <Button asChild className="w-full">
                    <Link href="/signup">Sign Up Again</Link>
                  </Button>
                )}
                {isRecovery && (
                  <Button asChild className="w-full">
                    <Link href="/forgot-password">Request New Reset Link</Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button onClick={handleVerify} className="w-full">
                {isRecovery ? "Reset Password" : "Verify Email"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
          <div className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5">
            <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div className="text-center">
                <Link
                  href="/"
                  aria-label="go home"
                  className="mx-auto block w-fit"
                >
                  <Image
                    src="/favicon.ico"
                    width={48}
                    height={48}
                    alt="nota"
                    style={{ display: "inline-block" }}
                  />
                </Link>
                <div className="mt-6 flex justify-center">
                  <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                    <Loader2 className="text-primary size-8 animate-spin" />
                  </div>
                </div>
                <h1 className="mt-6 mb-2 text-xl font-semibold">Loading...</h1>
              </div>
            </div>
          </div>
        </section>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
