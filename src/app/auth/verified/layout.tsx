import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Verified - nota",
  description: "Your email has been successfully verified.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmailVerifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

