"use client";

import { askAIAboutNotesAction } from "@/actions/notes";
import { getDecryptedApiKeyAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useApiKey from "@/hooks/use-api-key";
import "@/styles/ai-responses.css";
import { User } from "@supabase/supabase-js";
import { ArrowUp, KeyRound, Loader2, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

type Props = {
  user: User | null;
  type: "home" | "note";
};

function AskAIButton({ user, type }: Props) {
  const router = useRouter();
  const { apiKey, setApiKey } = useApiKey();

  const [isPending, startTransition] = useTransition();
  const [isCheckingApiKey, setIsCheckingApiKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

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

  const checkApiKey = async () => {
    setIsCheckingApiKey(true);
    try {
      // First check if we have it in context
      if (apiKey) {
        setHasApiKey(true);
        setIsCheckingApiKey(false);
        return;
      }

      // Otherwise, fetch it from the server
      const result = await getDecryptedApiKeyAction();
      if (result.apiKey) {
        setApiKey(result.apiKey);
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
    } catch (error) {
      setHasApiKey(false);
    } finally {
      setIsCheckingApiKey(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      checkApiKey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (isOpen) {
      setQuestionText("");
      setQuestions([]);
      setResponses([]);
    }
    setOpen(isOpen);
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

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (questionText.trim() === "") {
      return;
    }

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(ScrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(
        newQuestions,
        responses,
      ).catch((error) => {
        toast.error("Something went wrong. Please try again.");
        return null;
      });
      if (response) {
        setResponses((prev) => [...prev, response]);
        setTimeout(ScrollToBottom, 100);
      }
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
            className="focus-visible:ring-ring! text-foreground! focus-visible:border-ring! hover:text-accent-foreground! flex h-10! w-40! shrink-0! gap-2! rounded-full! border! font-semibold! shadow! outline-1! backdrop-blur-xl! transition-colors! outline-none!"
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
      <DialogContent
        className="flex h-[75vh] max-w-4xl! flex-col max-sm:max-w-sm!"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {isCheckingApiKey ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
              <p className="text-muted-foreground text-sm font-semibold">
                Checking API key...
              </p>
            </div>
          </div>
        ) : hasApiKey === false ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-bold">API Key Required</DialogTitle>
              <DialogDescription className="text-muted-foreground font-semibold">
                You need to set up your OpenAI API key to use the AI features.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
              <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
                <KeyRound className="text-primary size-10" />
              </div>

              <div className="max-w-md space-y-4 text-center">
                <h3 className="text-lg font-semibold">
                  How to Set Up Your API Key
                </h3>
                <div className="text-muted-foreground space-y-3 text-left text-sm">
                  <div className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      1
                    </span>
                    <p>
                      Open the Settings dialog by clicking on your profile
                      settings icon in the sidebar.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      2
                    </span>
                    <p>
                      Navigate to the <strong>Integrations</strong> tab.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      3
                    </span>
                    <p>
                      Enter your OpenAI API key (Project API key for
                      gpt-4o-mini).
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      4
                    </span>
                    <p>Click "Save API Key" to save your key.</p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4 text-left text-xs">
                  <p className="mb-2 font-semibold">Need an API Key?</p>
                  <p className="text-muted-foreground">
                    You can get your OpenAI API key from{" "}
                    <Link
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light hover:underline"
                    >
                      OpenAI Platform
                    </Link>
                    . Make sure to use a Project API key for gpt-4o-mini.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setOpen(false);
                  toast.info(
                    "Please open Settings from your profile in the sidebar",
                    {
                      description:
                        "Navigate to the Integrations tab to add your API key.",
                    },
                  );
                }}
                className="flex items-center gap-2"
              >
                <Settings className="size-4" />
                Open Settings
              </Button>
            </div>
          </>
        ) : (
          <>
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
                className={`from-background pointer-events-none absolute top-0 right-0 left-0 z-10 h-8 bg-linear-to-b to-transparent transition-opacity duration-150 ${
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
                className={`from-background pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-8 bg-linear-to-t to-transparent transition-opacity duration-150 ${
                  showBottomFade ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className={`mt-4 flex flex-col rounded-lg border p-4 ${
                  isPending ? "cursor-not-allowed" : "cursor-text"
                }`}
                onClick={handleClickInput}
              >
                <Textarea
                  ref={textAreaRef}
                  placeholder="Ask me anything about your notes..."
                  className="placeholder:text-muted-foreground! resize-none! rounded-none! border-none! bg-transparent! p-0! font-semibold! shadow-none! focus-visible:ring-0! focus-visible:ring-offset-0!"
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
                  type="submit"
                >
                  <ArrowUp className="size-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;
