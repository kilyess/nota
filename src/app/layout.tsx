import AppSidebar from "@/components/AppSidebar";
import DarkModeToggle from "@/components/DarkModeToggle";
import FloatingActions from "@/components/FloatingActions";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NoteProvider from "@/providers/NoteProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

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
  title: "Nota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrains.variable} ${proxima.variable}`}
      suppressHydrationWarning
    >
      <body className="h-[calc(100svh-2rem)] overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <main className="flex h-[calc(100svh-2rem)] w-full flex-col overflow-hidden">
                  <FloatingActions />
                  <DarkModeToggle />
                  <div className="min-h-0 flex-1 overflow-auto">{children}</div>
                </main>
              </SidebarInset>
            </SidebarProvider>
            <Toaster theme="system" richColors />
          </NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
