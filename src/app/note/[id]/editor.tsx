"use client";

import { updateNoteAction } from "@/actions/notes";
import MenuBar from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNote from "@/hooks/use-note";
import { User } from "@supabase/supabase-js";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import debounce from "lodash/debounce";
import { CloudCheck, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const extensions = [
  StarterKit.configure({
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
  }),
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
  const { noteTitle, setNoteTitle, setNoteUpdatedAt } = useNote();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id === noteId) {
      setNoteTitle(title);
    }
  }, [id, noteId, title, setNoteTitle]);

  const debouncedSave = useCallback(
    debounce(async (title: string, body: string) => {
      setIsSaving(true);
      await updateNoteAction(id, title, body);
      setIsSaving(false);
    }, 1000),
    [id],
  );

  const editor = useEditor({
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[calc(100vh-25rem)] flex-1 selection:bg-primary placeholder:select-none self-stretch px-3 py-1 mb-20 resize-none outline-none",
        spellCheck: "true",
      },
    },
    extensions,
    onUpdate: ({ editor }) => {
      forceUpdate((prev) => prev + 1);
      setNoteUpdatedAt(new Date());
      debouncedSave(noteTitle, editor.getHTML());
    },
    onSelectionUpdate: () => {
      forceUpdate((prev) => prev + 1);
    },
    onTransaction: () => {
      forceUpdate((prev) => prev + 1);
    },
  });

  return (
    <div className="animate-in fade-in-50 zoom-in-95 relative mx-auto flex w-full max-w-[45vw] flex-col items-center justify-center gap-5 pt-30 max-sm:max-w-[90vw]">
      <Button
        size="icon"
        variant="ghost"
        className="text-foreground pointer-events-none fixed top-4 right-13 flex cursor-default items-center gap-2 hover:!bg-transparent"
      >
        {isSaving ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <CloudCheck className="size-5" />
        )}
      </Button>

      <Input
        className="placeholder:!text-muted-foreground/50 !h-auto !min-h-0 w-full border-none !bg-transparent !text-5xl font-semibold placeholder:select-none focus:!ring-0"
        placeholder="New Note"
        value={noteTitle}
        onChange={(e) => {
          const newTitle = e.target.value;
          setNoteTitle(newTitle);
          setNoteUpdatedAt(new Date());
          debouncedSave(newTitle, editor?.getHTML() || "");
        }}
      />
      <div className="flex w-full flex-col gap-4 self-stretch">
        <MenuBar editor={editor} user={user} />
        <EditorContent editor={editor} className="w-full flex-1 px-2 sm:px-0" />
      </div>
    </div>
  );
}

export default NoteEditor;
