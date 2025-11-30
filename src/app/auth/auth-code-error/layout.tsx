import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Failed - nota",
  description: "The verification link is invalid or has expired.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCodeErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

