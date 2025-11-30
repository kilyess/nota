import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Content() {
  return (
    <section id="about" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Seamless Note-Taking
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Experience the future of note-taking. Write freely, organize
              effortlessly, and let our AI assistant help you recall details,
              summarize content, and generate new ideas from your existing
              knowledge.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-x-6">
              <Button asChild>
                <Link href="/signup">Start Writing</Link>
              </Button>
              <Button asChild variant="link" className="-ml-3">
                <Link href="/login">
                  Already have an account? Sign in &rarr;
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border shadow-xl sm:aspect-3/2 lg:aspect-auto lg:h-[500px]">
            <Image
              src="https://ecjnldeqsytvzylnjypq.supabase.co/storage/v1/object/public/logo/app-pic-light.png"
              alt="Content Light"
              fill
              className="inline object-cover object-top-left dark:hidden"
              priority
            />
            <Image
              src="https://ecjnldeqsytvzylnjypq.supabase.co/storage/v1/object/public/logo/app-pic-dark.png"
              alt="Content Dark"
              fill
              className="hidden object-cover object-top-left dark:inline"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
