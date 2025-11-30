import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email - nota",
  description: "Please check your email to verify your nota account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
