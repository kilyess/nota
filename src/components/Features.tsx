import { Brain, Lock, Search, Zap } from "lucide-react";

const features = [
  {
    title: "AI-Powered Assistance",
    description:
      "Ask questions about your notes and get intelligent answers instantly. Your personal knowledge base, supercharged.",
    icon: Brain,
  },
  {
    title: "Secure & Private",
    description:
      "Your notes are encrypted and secure. We prioritize your privacy so you can write freely.",
    icon: Lock,
  },
  {
    title: "Instant Search",
    description:
      "Find anything in seconds with our powerful search capabilities. Never lose a thought again.",
    icon: Search,
  },
  {
    title: "Lightning Fast",
    description:
      "Built for speed with a distraction-free interface. Capture ideas as fast as you can think them.",
    icon: Zap,
  },
];

export default function Features() {
    return (
    <section id="features" className="bg-muted/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-primary-light text-base leading-7 font-semibold">
            Deploy faster
          </h2>
          <p className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to know
          </p>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            nota combines the simplicity of a notepad with the power of
            artificial intelligence.
          </p>
                </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.title} className="relative pl-16">
                <dt className="text-foreground text-base leading-7 font-semibold">
                  <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon
                      className="text-primary-foreground h-6 w-6"
                      aria-hidden="true"
                                />
                  </div>
                  {feature.title}
                </dt>
                <dd className="text-muted-foreground mt-2 text-base leading-7">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
                </div>
            </div>
        </section>
  );
}
