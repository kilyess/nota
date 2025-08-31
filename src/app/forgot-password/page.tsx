"use client";

import { sendResetPasswordEmailAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionHandler } from "@/hooks/use-action-handler";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const {
    handler: sendResetPasswordEmail,
    isPending: isSendingResetPasswordEmail,
  } = useActionHandler(sendResetPasswordEmailAction);
  const router = useRouter();

  const handleResetPassword = async () => {
    sendResetPasswordEmail(
      {
        onSuccess: () => {
          router.replace("/");
        },
        loadingMessage: "Sending reset password email...",
        successMessage: "Reset password email sent successfully",
        successDescription:
          "Your reset password email has been sent successfully.",
        errorMessage: "Failed to send reset password email",
      },
      email,
    );
  };

  return (
    <div className="mt-20 flex flex-1 flex-col items-center max-sm:mx-auto max-sm:max-w-sm">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-1">
          <CardTitle className="text-center text-3xl">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your email below to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSendingResetPasswordEmail}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button
            onClick={handleResetPassword}
            disabled={isSendingResetPasswordEmail}
          >
            {isSendingResetPasswordEmail
              ? "Sending..."
              : "Send Reset Password Email"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
