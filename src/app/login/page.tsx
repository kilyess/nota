"use client";

import { loginAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
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
            message: "Log in failed",
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
            <h1 className="mt-4 mb-1 text-xl font-semibold">Log In to nota</h1>
            <p className="text-sm">Welcome back! Log in to continue</p>
          </div>

          <div className="mt-6 space-y-6">
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

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/forgot-password"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  name="pwd"
                  id="pwd"
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
            </div>

            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? "Logging In..." : "Log In"}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/signup">Create account</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}

export default LoginPage;
