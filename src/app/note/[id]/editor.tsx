"use client";

import MenuBar from "@/components/MenuBar";
import { Input } from "@/components/ui/input";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

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
  }),
  Placeholder.configure({
    placeholder: "Write your note here...",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph", "listItem", "bulletList", "orderedList"],
  }),
  Highlight.configure({
    multicolor: true,
  }),
];

function NoteEditor({ id }: { id: string }) {
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[200px] flex-1 selection:bg-primary placeholder:select-none self-stretch px-3 py-1 mb-20 resize-none outline-none",
        spellCheck: "true",
      },
    },
    extensions,
    onUpdate: ({ editor }) => {
      forceUpdate((prev) => prev + 1);
      console.log(editor.getHTML());
    },
    onSelectionUpdate: () => {
      forceUpdate((prev) => prev + 1);
    },
    onTransaction: () => {
      forceUpdate((prev) => prev + 1);
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[45vw] flex-col items-center justify-center gap-5 pt-30">
      <Input
        className="placeholder:!text-muted-foreground/50 !h-auto !min-h-0 w-full border-none !bg-transparent !text-5xl font-semibold placeholder:select-none focus:!ring-0"
        placeholder="New Note"
      />
      <div className="flex w-full flex-col gap-4 self-stretch">
        {editor && <MenuBar editor={editor} />}
        <EditorContent
          editor={editor}
          className="min-h-[200px] w-full flex-1"
        />
      </div>
    </div>
  );
}

export default NoteEditor;
