"use client";

import { loginAction, signUpAction } from "@/actions/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  type: "login" | "signup";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      let firstName: string;
      let lastName: string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (isLoginForm) {
        const promise = new Promise<{ errorMessage: string | null }>(
          async (resolve, reject) => {
            const result = await loginAction(email, password);
            if (result.errorMessage) {
              reject(new Error(result.errorMessage));
            } else {
              resolve(result);
            }
          },
        );
        toast.promise(promise, {
          loading: "Logging in...",
          success: () => {
            router.replace("/");
            return {
              message: "Logged in",
              description: "You have been successfully logged in.",
            };
          },
          error: (error) => {
            return {
              message: "Login failed",
              description: error.message,
            };
          },
        });
      } else {
        firstName = formData.get("firstName") as string;
        lastName = formData.get("lastName") as string;
        const promise = new Promise<{ errorMessage: string | null }>(
          async (resolve, reject) => {
            const result = await signUpAction(
              firstName,
              lastName,
              email,
              password,
            );
            if (result.errorMessage) {
              reject(new Error(result.errorMessage));
            } else {
              resolve(result);
            }
          },
        );
        toast.promise(promise, {
          loading: "Signing up...",
          success: () => {
            router.replace("/");
            return {
              message: "Signed up",
              description: "Check your email for confirmation link.",
            };
          },
          error: (error) => {
            return {
              message: "Sign up failed",
              description: error.message,
            };
          },
        });
      }
    });
  };
  return (
    <form action={handleSubmit}>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2" hidden={isLoginForm}>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="firstName"
              placeholder="Enter your first name"
              required={isLoginForm}
              disabled={isPending || isLoginForm}
            />
          </div>
          <div className="grid gap-2" hidden={isLoginForm}>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="lastName"
              placeholder="Enter your last name"
              required={isLoginForm}
              disabled={isPending || isLoginForm}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center" hidden={!isLoginForm}>
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Label htmlFor="password" hidden={isLoginForm}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              disabled={isPending}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-6 flex-col gap-4">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isLoginForm ? "Login" : "Sign Up"}
        </Button>
        <p className="text-sm">
          {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "signup" : "login"}
            className={`text-ring hover:underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
