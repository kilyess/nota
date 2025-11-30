"use client";

import { signUpAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("One lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("One number");
  }
  if (!/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
    errors.push("One special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function SignUpPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordValidation = validatePassword(password);
  const isPasswordValid = passwordValidation.isValid;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Please fix password requirements", {
        description: passwordValidation.errors.join(", "),
      });
      return;
    }

    startTransition(async () => {
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
          router.replace("/signup/confirm");
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
    });
  };

  return (
    <section className="bg-background flex min-h-screen px-4 py-16 md:py-32">
      <form
        onSubmit={handleSubmit}
        className="bg-muted/50 m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/favicon.ico"
                width={48}
                height={48}
                alt="nota"
                style={{ display: "inline-block" }}
              />
      </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Create a nota Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="block text-sm">
                  First Name
                </Label>
                <Input
                  type="text"
                  required
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="block text-sm">
                  Last Name
                </Label>
                <Input
                  type="text"
                  required
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input sz-md variant-mixed pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full p-1.5 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
              {password && !isPasswordValid && (
                <div className="text-muted-foreground text-xs">
                  <p className="mb-1 font-medium">Password must contain:</p>
                  <ul className="ml-4 list-disc space-y-0.5">
                    {passwordValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              disabled={isPending || !isPasswordValid}
              type="submit"
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>

        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Log In</Link>
            </Button>
          </p>
    </div>
      </form>
    </section>
  );
}

export default SignUpPage;
