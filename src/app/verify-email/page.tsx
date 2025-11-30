"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createClient();
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || !type) {
          setStatus("error");
          setErrorMessage("Invalid verification link.");
          return;
        }

        // Verify the email using Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as "email",
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
            router.replace("/login");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "An error occurred",
        );
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
              {status === "loading" && (
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
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {status === "loading" &&
                "Please wait while we verify your email address."}
              {status === "success" &&
                "Your email has been successfully verified. You will be redirected to the login page shortly."}
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
            {status === "success" && (
              <Button asChild className="w-full">
                <Link href="/login">Go to Sign In</Link>
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
