"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignUpConfirmPage() {
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
              <div className="bg-primary/10 flex size-16 items-center justify-center rounded-full">
                <Mail className="text-primary size-8" />
              </div>
            </div>
            <h1 className="mt-6 mb-2 text-xl font-semibold">
              Check Your Email
            </h1>
            <p className="text-muted-foreground text-sm">
              We've sent a confirmation link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-muted rounded-lg p-4 text-left">
                <p className="text-muted-foreground text-xs font-medium">
                  Didn't receive the email?
                </p>
                <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email address</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild className="w-full">
              <Link href="/login">Back to Log In</Link>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Already verified?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Log In</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
