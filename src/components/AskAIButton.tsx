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
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

    setQuestions((prev) => [...prev, questionText]);
    setQuestionText("");
    setTimeout(ScrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(questions, responses);
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
        <Button variant="ghost">
          <Sparkles className="size-4" />
          <span className="hidden sm:block">Ask AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="custom-scrollbar flex h-[75vh] !max-w-4xl flex-col overflow-y-auto"
        ref={contentRef}
      >
        <DialogHeader>
          <DialogTitle className="font-bold">
            Ask AI about your notes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-semibold">
            The AI will answer your questions about your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-8">
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
              <p className="animate-pulse text-sm font-semibold">Thinking...</p>
            </div>
          )}
        </div>

        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
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
          />
          <Button
            className="ml-auto size-8 rounded-full"
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
