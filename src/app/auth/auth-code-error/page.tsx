"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthCodeErrorPage() {
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
              <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
                <XCircle className="text-destructive size-8" />
              </div>
            </div>
            <h1 className="mt-6 mb-2 text-xl font-semibold">
              Verification Failed
            </h1>
            <p className="text-muted-foreground text-sm">
              This verification link is invalid or has expired. Please request a
              new verification email.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-muted rounded-lg p-4 text-left">
                <p className="text-muted-foreground text-xs font-medium">
                  What can you do?
                </p>
                <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                  <li>• Request a new verification email</li>
                  <li>• Check if the link has expired</li>
                  <li>• Make sure you're using the latest link</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button asChild className="w-full">
              <Link href="/signup">Sign Up Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Back to Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

