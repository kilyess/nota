"use client";

import { updateNoteAction } from "@/actions/notes";
import { CodeBlockExtension } from "@/components/extensions/CodeBlockExtension";
import MenuBar from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import useNote from "@/hooks/use-note";
import { Note } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CloudCheck, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "list-item",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "blockquote",
      },
    },
    link: {
      openOnClick: false,
      HTMLAttributes: {
        class:
          "text-ring hover:!underline hover:text-ring/80 cursor-pointer !no-underline",
      },
    },
  }),
  CodeBlockExtension,
  Placeholder.configure({
    placeholder: "Write your note here...",
  }),
  TextAlign.configure({
    types: [
      "heading",
      "paragraph",
      "listItem",
      "bulletList",
      "orderedList",
      "blockquote",
    ],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  TaskList,
  TaskItem,
];

type Props = {
  id: string;
  title: string;
  content: string;
  user: User | null;
};

function NoteEditor({ id, title, content, user }: Props) {
  const { id: noteId } = useParams();
  const [, forceUpdate] = useState(0);
  const { noteTitle, setNoteTitle, updateNote, notes } = useNote();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id === noteId) {
      setNoteTitle(title);
    }
  }, [id, noteId, title, setNoteTitle]);

  const debouncedSave = useDebouncedCallback(
    async (title: string, body: string) => {
      setIsSaving(true);
      try {
        const result = await updateNoteAction(id, title, body);
        if (result.errorMessage) {
          throw new Error(result.errorMessage);
        }
        const oldNote = notes.find((n) => n.id === id);
        const updatedNote = {
          ...(oldNote as Note),
          title,
          body,
          updatedAt: new Date(),
        };
        updateNote(updatedNote);
      } catch (error) {
        toast.error("Failed to save note");
      } finally {
        setIsSaving(false);
      }
    },
    1000,
  );

  const editor = useEditor({
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[calc(100vh-25rem)] flex-1 selection:bg-primary placeholder:select-none self-stretch px-3 py-1 mb-20 resize-none outline-none font-medium",
        spellCheck: "true",
      },
    },
    extensions,
    autofocus: false,
    onUpdate: ({ editor }) => {
      forceUpdate((prev) => prev + 1);
      debouncedSave(noteTitle, editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="text-foreground group pointer-events-auto fixed top-4 right-13 flex cursor-default items-center gap-2 hover:!bg-transparent"
          >
            {isSaving ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <CloudCheck className="size-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {notes.find((n) => n.id === id)?.updatedAt
            ? `Last saved: ${notes.find((n) => n.id === id)?.updatedAt.toLocaleString()}`
            : ""}
        </TooltipContent>
      </Tooltip>
      <div className="animate-in fade-in-50 zoom-in-95 relative flex w-full max-w-[55vw] flex-col items-center justify-center gap-5 pt-30 max-md:max-w-[90vw] max-sm:max-w-[90vw]">
        <Input
          className="placeholder:!text-muted-foreground/50 !h-auto !min-h-0 w-full border-none !bg-transparent !text-5xl font-semibold placeholder:select-none focus:!ring-0 max-md:!text-4xl max-sm:!text-3xl lg:!text-5xl"
          placeholder="New Note"
          value={noteTitle}
          onChange={(e) => {
            const newTitle = e.target.value;
            setNoteTitle(newTitle);
            debouncedSave(newTitle, editor?.getHTML() || "");
          }}
        />
        <div className="flex w-full flex-col gap-4 self-stretch">
          <MenuBar editor={editor} user={user} />
          <EditorContent
            editor={editor}
            className="w-full flex-1 px-2 sm:px-0"
          />
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
