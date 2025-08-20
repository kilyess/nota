import { Button } from "@/components/ui/button";
import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import { Notebook, NotebookPen, Sparkles } from "lucide-react";

async function HomePage() {
  const user = await getUser();

  let firstName: string | undefined = "";

  if (user) {
    const userdb = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    firstName = userdb?.firstName;
  }

  return (
    <div
      className="absolute inset-0 overflow-y-scroll sm:pt-3.5"
      style={{
        paddingBottom: "144px",
        scrollbarGutter: "stable both-edges",
        scrollPaddingBottom: "104px",
      }}
    >
      <div className="pt-safe-offset-10 max-w-axl mx-auto flex w-full flex-col items-center space-y-12 px-4 pb-16">
        <div className="flex h-[calc(100vh-20rem)] items-center justify-center">
          <div className="animate-in fade-in-50 zoom-in-95 flex w-full flex-col items-center justify-center space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 sm:px-8">
            <h2 className="text-3xl font-semibold">
              {user
                ? `Hi ${firstName}, How can I help?`
                : "Hey there, please login or sign up to create notes!"}
            </h2>
            <div className="flex flex-row gap-2.5 max-sm:justify-evenly">
              <Button
                variant="outline"
                className="focus-visible:ring-ring bg-primary text-primary-foreground focus-visible:border-ring hover:text-accent-foreground flex h-10 w-40 shrink-0 gap-1 !rounded-full border font-semibold shadow outline-1 backdrop-blur-xl transition-colors outline-none hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2"
              >
                <Notebook />
                New Note
              </Button>
              <Button
                variant="outline"
                className="focus-visible:ring-ring bg-primary text-primary-foreground focus-visible:border-ring hover:text-accent-foreground flex h-10 w-40 shrink-0 gap-1 !rounded-full border font-semibold shadow outline-1 backdrop-blur-xl transition-colors outline-none hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2"
              >
                <NotebookPen />
                New AI Note
              </Button>
              <Button
                variant="outline"
                className="focus-visible:ring-ring bg-primary text-primary-foreground focus-visible:border-ring hover:text-accent-foreground flex h-10 w-40 shrink-0 gap-1 !rounded-full border font-semibold shadow outline-1 backdrop-blur-xl transition-colors outline-none hover:bg-pink-600/90 max-sm:size-16 max-sm:flex-col sm:gap-2"
              >
                <Sparkles />
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
