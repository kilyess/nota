import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email - nota",
  description: "Verify your email address to complete your nota account setup.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
