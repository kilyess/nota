import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset Successful - nota",
  description: "Your password has been successfully reset.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
