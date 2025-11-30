"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EmailVerifiedPage() {
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
              <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-8 text-green-500" />
              </div>
            </div>
            <h1 className="mt-6 mb-2 text-xl font-semibold">
              Email Verified!
            </h1>
            <p className="text-muted-foreground text-sm">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
          </div>

          <div className="mt-6">
            <Button asChild className="w-full">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

