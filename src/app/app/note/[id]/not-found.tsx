import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export default function NoteNotFound() {
  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <FileQuestion className="text-muted-foreground mx-auto h-16 w-16" />
        </div>
        <h1 className="text-foreground mb-2 text-4xl font-bold">Not Found</h1>
        <h2 className="text-muted-foreground mb-4 text-xl font-semibold">
          There is no such note
        </h2>
        <p className="text-muted-foreground mb-8">
          The note you are looking for does not exist or you do not have permission to view it.
        </p>
        <div className="flex flex-col items-center gap-2 max-sm:mx-auto max-sm:max-w-sm sm:flex-row sm:justify-center">
          <Button asChild>
            <Link className="max-sm:w-50" href="/app">
              <Home className="h-4 w-4" />
              Back to Notes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

