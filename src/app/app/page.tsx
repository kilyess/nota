import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import SearchButton from "@/components/SearchButton";
import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";

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
            <div className="flex flex-row gap-2.5 max-sm:flex-col max-sm:justify-evenly">
              <NewNoteButton type="home" />
              <AskAIButton user={user} type="home" />
              <SearchButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
