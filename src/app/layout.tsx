import AppSidebar from "@/components/AppSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import FloatingActions from "@/components/FloatingActions";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import { PlusIcon, Search, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Nota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <main>
                <FloatingActions />
                <DarkModeToggle />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster theme="system" position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
