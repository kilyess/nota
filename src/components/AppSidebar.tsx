import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";
import { Note, User } from "@prisma/client";
import Link from "next/link";
import Logo from "./Logo";
import { NavUser } from "./NavUser";
import SearchBar from "./SearchBar";
import SidebarGroupContent from "./SidebarGroupContent";
import { Button } from "./ui/button";

async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();

  let notes: Note[] = [];
  let userdb: User | null = null;

  if (user) {
    notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    userdb = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }

  // const handleNewNote = () => {
  //   if (!user) {
  //     toast.warning("Not logged in", {
  //       description: "Please login or sign up to create a new note.",
  //     });
  //   }
  // };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex h-14 w-full items-center justify-center py-4">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Button className="w-56 self-center font-bold">New Note</Button>
        <div className="border-card border-b px-3">
          <SearchBar />
        </div>
        {user && <SidebarGroupContent notes={notes} />}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={userdb} />
        ) : (
          <>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
