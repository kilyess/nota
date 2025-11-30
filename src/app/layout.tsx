import AppToaster from "@/components/AppToaster";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";

const proxima = localFont({
  src: "../../public/fonts/Proxima Vara-VF.ttf",
  variable: "--font-proxima",
});

const zenbonesMono = localFont({
  src: "../../public/fonts/Zenbones-Mono-Regular.woff2",
  variable: "--font-zenbones",
});

const notoSans = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-noto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "nota - AI-Powered Note-Taking Web App",
  description:
    "nota is a user-friendly note-taking app with an integrated AI assistant, allowing you to ask questions and get instant answers based on your notes. ",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${proxima.variable} ${notoSans.variable} ${zenbonesMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
