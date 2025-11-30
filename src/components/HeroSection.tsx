import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { HeroHeader } from "./Header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export default function HeroSection() {
  return (
    <>
      <HeroHeader />

      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 pt-32 pb-20 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-5xl font-medium text-balance md:text-6xl"
              >
                Your AI-Powered Note-Taking Companion
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-lg text-pretty"
              >
                Organize your thoughts, ask questions, and get instant answers
                from your notes. Experience a seamless, distraction-free
                interface designed for clarity.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-12"
              >
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                </div>

                <div
                  aria-hidden
                  className="from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl bg-radial to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-[280px] -translate-x-2 -translate-y-8 rounded-3xl border mask-[linear-gradient(to_bottom,#000_50%,transparent_90%)] p-1.5 sm:w-80 sm:-translate-x-3 sm:-translate-y-12 sm:rounded-4xl sm:p-2">
                    <div className="relative h-64 overflow-hidden rounded-2xl border p-1.5 pb-8 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50 sm:h-96 sm:rounded-3xl sm:p-2 sm:pb-12"></div>
                  </div>
                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-[280px] translate-x-2 rounded-3xl border mask-[linear-gradient(to_bottom,#000_50%,transparent_90%)] p-1.5 backdrop-blur-3xl sm:w-80 sm:translate-x-8 sm:rounded-4xl sm:p-2">
                    <div className="bg-background space-y-1.5 overflow-hidden rounded-2xl border p-1.5 shadow-xl sm:space-y-2 sm:rounded-3xl sm:p-2 dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <AppComponent />

                      <div className="bg-muted rounded-xl p-2 pb-8 sm:rounded-2xl sm:p-4 sm:pb-16 dark:bg-white/5"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[16px_16px] mix-blend-overlay dark:opacity-5"></div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const AppComponent = () => {
  return (
    <div className="relative space-y-2 rounded-xl bg-white/5 p-2.5 sm:space-y-3 sm:rounded-2xl sm:p-4">
      <div className="text-primary-light flex items-center gap-1">
        <Sparkles className="size-3.5 sm:size-5" />
        <div className="text-[10px] font-medium sm:text-sm">AI Insight</div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="text-foreground border-b border-white/10 pb-2 text-[10px] leading-tight font-medium sm:pb-3 sm:text-sm sm:leading-normal">
          Based on your recent notes, you're focusing heavily on productivity
          and AI integration.
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-0.5 gap-y-0">
              <span className="text-foreground text-base font-medium sm:text-xl">
                12
              </span>
              <span className="text-muted-foreground text-[9px] leading-tight sm:text-xs sm:leading-normal">
                Notes Created
              </span>
            </div>
            <div className="bg-primary text-primary-foreground flex h-4 items-center rounded px-1.5 text-[9px] sm:h-5 sm:px-2 sm:text-xs">
              This Week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
