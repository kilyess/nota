import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a new nota account to start organizing your notes with AI-powered features.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
