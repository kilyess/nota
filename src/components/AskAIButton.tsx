"use client";

import { askAIAboutNotesAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "@/styles/ai-responses.css";
import { User } from "@supabase/supabase-js";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";

type Props = {
  user: User | null;
  type: "home" | "note";
};

function AskAIButton({ user, type }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = content;

      setShowTopFade(scrollTop > 10);

      setShowBottomFade(scrollTop + clientHeight < scrollHeight - 10);
    };

    handleScroll();

    content.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [questions, responses]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const handleInput = () => {
    const textArea = textAreaRef.current;
    if (!textArea) {
      return;
    }
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    const textArea = textAreaRef.current;
    if (!textArea) {
      return;
    }
    textArea.focus();
  };

  const handleSubmit = () => {
    if (questionText.trim() === "") {
      return;
    }

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(ScrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);
      setTimeout(ScrollToBottom, 100);
    });
  };

  const ScrollToBottom = () => {
    const content = contentRef.current;
    if (!content) {
      return;
    }
    content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        {type === "home" ? (
          <Button
            variant="outline"
            className="focus-visible:!ring-ring !text-foreground focus-visible:!border-ring hover:!text-accent-foreground flex !h-10 !w-40 !shrink-0 !gap-2 !rounded-full !border !font-semibold !shadow !outline-1 !backdrop-blur-xl !transition-colors !outline-none"
          >
            <Sparkles />
            Ask AI
          </Button>
        ) : (
          <Button variant="ghost">
            <Sparkles className="size-4" />
            <span className="hidden sm:block">Ask AI</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-[75vh] !max-w-4xl flex-col max-sm:!max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-bold">
            Ask AI about your notes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-semibold">
            The AI will answer your questions about your notes.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden">
          <div
            className={`from-background pointer-events-none absolute top-0 right-0 left-0 z-10 h-8 bg-gradient-to-b to-transparent transition-opacity duration-150 ${
              showTopFade ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="h-full overflow-y-auto px-2" ref={contentRef}>
            <div className="flex flex-col gap-8">
              {questions.map((question, index) => (
                <Fragment key={index}>
                  <p className="bg-primary text-primary-foreground ml-auto max-w-[60%] rounded-md p-3 text-sm font-semibold">
                    {question}
                  </p>
                  {responses[index] && (
                    <p
                      className="bot-response text-muted-foreground text-sm"
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                    />
                  )}
                </Fragment>
              ))}
              {isPending && (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <p className="animate-pulse text-sm font-semibold">
                    Thinking...
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className={`from-background pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-8 bg-gradient-to-t to-transparent transition-opacity duration-150 ${
              showBottomFade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div
          className={`mt-4 flex flex-col rounded-lg border p-4 ${
            isPending ? "cursor-not-allowed" : "cursor-text"
          }`}
          onClick={handleClickInput}
        >
          <Textarea
            ref={textAreaRef}
            placeholder="Ask me anything about your notes..."
            className="placeholder:!text-muted-foreground !resize-none !rounded-none !border-none !bg-transparent !p-0 !font-semibold !shadow-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
            style={{ minHeight: "0", lineHeight: "normal" }}
            rows={1}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={isPending}
          />
          <Button
            className="ml-auto size-8 rounded-full"
            disabled={isPending}
            onClick={handleSubmit}
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;
