"use client";

import { User } from "@supabase/supabase-js";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AskAIButton from "./AskAIButton";
import { LinkPopover } from "./LinkPopover";
import { Toggle } from "./ui/toggle";

type Props = {
  editor: Editor | null;
  user: User | null;
};

const MenuBar = ({ editor, user }: Props) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const atLeft = el.scrollLeft <= 0;
      const atRight =
        Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
      setShowLeftFade(!atLeft);
      setShowRightFade(!atRight);
    };

    update();
    el.addEventListener("scroll", update, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update as unknown as EventListener);
      window.removeEventListener("resize", update);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const headingOptions = [
    {
      name: "Heading 1",
      icon: <Heading1 className="size-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: <Heading2 className="size-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: <Heading3 className="size-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
  ];

  const formattingOptions = [
    {
      name: "Bold",
      icon: <Bold className="size-5" />,
      onClick: () => {
        if (editor.isActive("bold")) {
          editor.chain().focus().unsetBold().run();
        } else {
          editor.chain().focus().setBold().run();
        }
      },
      pressed: editor.isActive("bold"),
    },
    {
      name: "Italic",
      icon: <Italic className="size-5" />,
      onClick: () => {
        if (editor.isActive("italic")) {
          editor.chain().focus().unsetItalic().run();
        } else {
          editor.chain().focus().setItalic().run();
        }
      },
      pressed: editor.isActive("italic"),
    },
    {
      name: "Strikethrough",
      icon: <Strikethrough className="size-5" />,
      onClick: () => {
        if (editor.isActive("strike")) {
          editor.chain().focus().unsetStrike().run();
        } else {
          editor.chain().focus().setStrike().run();
        }
      },
      pressed: editor.isActive("strike"),
    },
    {
      name: "Inline Code",
      icon: <Code className="size-5" />,
      onClick: () => {
        if (editor.isActive("code")) {
          editor.chain().focus().unsetCode().run();
        } else {
          editor.chain().focus().setCode().run();
        }
      },
      pressed: editor.isActive("code"),
    },
    {
      name: "Highlight",
      icon: <Highlighter className="size-5" />,
      onClick: () => {
        if (editor.isActive("highlight")) {
          editor.chain().focus().unsetHighlight().run();
        } else {
          editor
            .chain()
            .focus()
            .setHighlight({ color: "var(--primary)" })
            .run();
        }
      },
      pressed: editor.isActive("highlight"),
    },
  ];

  const blockOptions = [
    {
      name: "Code Block",
      icon: <Terminal className="size-5" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
    },
    {
      name: "Blockquote",
      icon: <Quote className="size-5" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: editor.isActive("blockquote"),
    },
    {
      name: "Horizontal Rule",
      icon: <Minus className="size-5" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: false, // HR doesn't have an active state
    },
  ];

  const listOptions = [
    {
      name: "Bullet List",
      icon: <List className="size-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      name: "Ordered List",
      icon: <ListOrdered className="size-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
  ];

  const alignOptions = [
    {
      name: "Align Left",
      icon: <AlignLeft className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed:
        editor.isActive({ textAlign: "left" }) ||
        (!editor.isActive({ textAlign: "center" }) &&
          !editor.isActive({ textAlign: "right" }) &&
          !editor.isActive({ textAlign: "justify" })),
    },
    {
      name: "Align Center",
      icon: <AlignCenter className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      name: "Align Right",
      icon: <AlignRight className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      name: "Align Justify",
      icon: <AlignJustify className="size-5" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      pressed: editor.isActive({ textAlign: "justify" }),
    },
  ];

  const Separator = () => (
    <span
      className="bg-border mx-1 inline-block h-6 w-px align-middle max-sm:hidden"
      aria-hidden="true"
    />
  );

  return (
    <div className="bg-background border-accent sticky top-0 z-50 flex gap-1 border-b px-2 py-2">
      <div className="relative flex min-w-0 flex-1">
        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden"
        >
          {headingOptions.map((option) => (
            <Toggle
              key={option.name}
              onPressedChange={option.onClick}
              pressed={option.pressed}
              className="cursor-pointer"
            >
              {option.icon}
            </Toggle>
          ))}
          <Separator />
          {formattingOptions.map((option) => (
            <Toggle
              key={option.name}
              onPressedChange={option.onClick}
              pressed={option.pressed}
              className="cursor-pointer"
            >
              {option.icon}
            </Toggle>
          ))}
          <Separator />
          {blockOptions.map((option) => (
            <Toggle
              key={option.name}
              onPressedChange={option.onClick}
              pressed={option.pressed}
              className="cursor-pointer"
            >
              {option.icon}
            </Toggle>
          ))}
          <LinkPopover editor={editor} />
          <Separator />
          {listOptions.map((option) => (
            <Toggle
              key={option.name}
              onPressedChange={option.onClick}
              pressed={option.pressed}
              className="cursor-pointer"
            >
              {option.icon}
            </Toggle>
          ))}
          <Separator />
          {alignOptions.map((option) => (
            <Toggle
              key={option.name}
              onPressedChange={option.onClick}
              pressed={option.pressed}
              className="cursor-pointer"
            >
              {option.icon}
            </Toggle>
          ))}
        </div>
        <div
          aria-hidden
          className={`from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r to-transparent transition-opacity duration-150 ${showLeftFade ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden
          className={`from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l to-transparent transition-opacity duration-150 ${showRightFade ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div className="ml-auto">
        <AskAIButton user={user} />
      </div>
    </div>
  );
};

export default MenuBar;
