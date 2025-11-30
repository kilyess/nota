import AppSidebar from "@/components/AppSidebar";
import AppToaster from "@/components/AppToaster";
import CommandMenu from "@/components/CommandMenu";
import DarkModeToggle from "@/components/DarkModeToggle";
import FloatingActions from "@/components/FloatingActions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import { decryptString } from "@/lib/crypto";
import { ApiKeyProvider } from "@/providers/ApiKeyProvider";
import CommandProvider from "@/providers/CommandProvider";
import NoteProvider from "@/providers/NoteProvider";
import "@/styles/globals.css";
import { getUser } from "@/utils/supabase/server";
import { Note, User } from "@prisma/client";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  let notes: (Pick<
    Note,
    "id" | "title" | "pinned" | "updatedAt" | "createdAt" | "authorId"
  > & { body: string })[] = [];
  let userdb: User | null = null;

  if (user) {
    const encryptedNotes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      select: {
        id: true,
        title: true,
        pinned: true,
        updatedAt: true,
        createdAt: true,
        authorId: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    notes = await Promise.all(
      encryptedNotes.map(async (n) => ({
        ...n,
        title: await decryptString(n.title as unknown as string),
        body: "",
      })),
    );

    userdb = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }
  return (
    <div className="overflow-hidden" suppressHydrationWarning>
      <CommandProvider>
        <NoteProvider>
          <ApiKeyProvider>
            <SidebarProvider>
              <AppSidebar notes={notes} user={userdb} isLoggedIn={!!user} />
              <SidebarInset>
                <main className="flex h-[calc(100svh-2rem)] w-full flex-col overflow-hidden">
                  <FloatingActions />
                  <div className="fixed top-4 right-4 z-50">
                    <DarkModeToggle />
                  </div>
                  <div className="min-h-0 flex-1 overflow-auto">{children}</div>
                  <CommandMenu notes={notes} />
                </main>
              </SidebarInset>
            </SidebarProvider>
          </ApiKeyProvider>
        </NoteProvider>
      </CommandProvider>
    </div>
  );
}
