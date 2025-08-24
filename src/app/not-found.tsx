import { Button } from "@/components/ui/button";
import { FileX, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <FileX className="text-muted-foreground mx-auto h-16 w-16" />
        </div>
        <h1 className="text-foreground mb-2 text-4xl font-bold">404</h1>
        <h2 className="text-muted-foreground mb-4 text-xl font-semibold">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col items-center gap-2 max-sm:mx-auto max-sm:max-w-sm sm:flex-row sm:justify-center">
          <Button asChild>
            <Link className="max-sm:w-50" href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link className="max-sm:w-50" href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
