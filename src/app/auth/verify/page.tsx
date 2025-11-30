"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { EmailOtpType, MobileOtpType } from "@supabase/supabase-js";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token_hash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const next = searchParams.get("next") ?? "/login";

  const handleVerify = async () => {
    if (!token_hash || !typeParam) {
      setStatus("error");
      setErrorMessage("Invalid verification link.");
      return;
    }

    setStatus("verifying");

    try {
      const supabase = createClient();

      // Verify the email using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        type: typeParam as EmailOtpType,
        token_hash,
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      if (data) {
        setStatus("success");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.replace(next);
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
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
              {status === "idle" && (
                <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-primary size-8" />
                </div>
              )}
              {status === "verifying" && (
                <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                  <Loader2 className="text-primary size-8 animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="size-8 text-green-500" />
                </div>
              )}
              {status === "error" && (
                <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
                  <XCircle className="text-destructive size-8" />
                </div>
              )}
            </div>
            <h1 className="mt-6 mb-2 text-xl font-semibold">
              {status === "idle" && "Verify Your Email"}
              {status === "verifying" && "Verifying..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {status === "idle" &&
                "Click the button below to verify your email address."}
              {status === "verifying" &&
                "Please wait while we verify your email address."}
              {status === "success" &&
                "Your email has been successfully verified. You will be redirected shortly."}
              {status === "error" &&
                (errorMessage ||
                  "This verification link is invalid or has expired.")}
            </p>
            {status === "error" && (
              <div className="mt-6 space-y-4">
                <div className="bg-muted rounded-lg p-4 text-left">
                  <p className="text-muted-foreground text-xs font-medium">
                    What can you do?
                  </p>
                  <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                    <li>• Request a new verification email</li>
                    <li>• Check if the link has expired</li>
                    <li>• Make sure you're using the latest link</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            {status === "idle" && (
              <Button onClick={handleVerify} className="w-full">
                Verify Email
              </Button>
            )}
            {status === "success" && (
              <Button asChild className="w-full">
                <Link href={next}>Continue</Link>
              </Button>
            )}
            {status === "error" && (
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/signup">Sign Up Again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
              </div>
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
