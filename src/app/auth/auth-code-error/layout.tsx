import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Failed",
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
