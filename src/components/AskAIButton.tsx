import { User } from "@supabase/supabase-js";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  return (
    <Button variant="ghost">
      <Sparkles className="size-4" />
      <span className="hidden sm:block">Ask AI</span>
    </Button>
  );
}

export default AskAIButton;
