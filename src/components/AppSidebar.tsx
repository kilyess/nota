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
import NewNoteButton from "./NewNoteButton";
import SidebarContentWrapper from "./SidebarContentWrapper";
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

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex h-14 w-full items-center justify-center py-4">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NewNoteButton user={user} type="sidebar" />
        {user && <SidebarContentWrapper notes={notes} />}
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
