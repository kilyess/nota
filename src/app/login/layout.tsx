import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your nota account to access your notes and AI-powered insights.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
