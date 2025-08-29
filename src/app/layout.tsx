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
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { getUser } from "@/utils/supabase/server";
import { Note, User } from "@prisma/client";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

const proxima = localFont({
  src: "../../public/fonts/Proxima Vara-VF.ttf",
  variable: "--font-proxima",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "nota",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    notes = await Promise.all(
      notes.map(async (n) => ({
        ...n,
        title: await decryptString(n.title as unknown as string),
        body: await decryptString(n.body as unknown as string),
      })),
    );

    userdb = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }
  return (
    <html
      lang="en"
      className={`${jetbrains.variable} ${proxima.variable}`}
      suppressHydrationWarning
    >
      <body className="h-[calc(100svh-2rem)] overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CommandProvider>
            <NoteProvider>
              <ApiKeyProvider>
                <SidebarProvider>
                  <AppSidebar notes={notes} user={userdb} isLoggedIn={!!user} />
                  <SidebarInset>
                    <main className="flex h-[calc(100svh-2rem)] w-full flex-col overflow-hidden">
                      <FloatingActions />
                      <DarkModeToggle />
                      <div className="min-h-0 flex-1 overflow-auto">
                        {children}
                      </div>
                      <CommandMenu notes={notes} />
                    </main>
                  </SidebarInset>
                </SidebarProvider>
              </ApiKeyProvider>
              <AppToaster />
            </NoteProvider>
          </CommandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
