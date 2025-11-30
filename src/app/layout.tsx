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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nota.ma"),
  title: {
    default: "nota - AI-Powered Note-Taking Web App",
    template: "%s | nota",
  },
  description:
    "nota is a user-friendly note-taking app with an integrated AI assistant, allowing you to ask questions and get instant answers based on your notes. Organize your thoughts, collaborate seamlessly, and boost productivity.",
  keywords: [
    "note-taking app",
    "AI assistant",
    "productivity",
    "note organization",
    "AI notes",
    "smart notes",
    "collaborative notes",
  ],
  authors: [{ name: "nota" }],
  creator: "nota",
  publisher: "nota",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "nota",
    title: "nota - AI-Powered Note-Taking Web App",
    description:
      "Organize your thoughts, ask questions, and get instant answers from your notes. Experience a seamless, distraction-free interface designed for clarity.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "nota - AI-Powered Note-Taking App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "nota - AI-Powered Note-Taking Web App",
    description:
      "Organize your thoughts, ask questions, and get instant answers from your notes.",
    images: ["/og-image.png"],
    creator: "@nota",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
