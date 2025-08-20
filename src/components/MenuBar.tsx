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
import { Toggle } from "./ui/toggle";

const MenuBar = ({ editor }: { editor: Editor }) => {
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
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      name: "Italic",
      icon: <Italic className="size-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      name: "Strikethrough",
      icon: <Strikethrough className="size-5" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      name: "Inline Code",
      icon: <Code className="size-5" />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      pressed: editor.isActive("code"),
    },
    {
      name: "Highlight",
      icon: <Highlighter className="size-5" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: "var(--primary)" })
          .run(),
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
      className="bg-border mx-1 inline-block h-6 w-px align-middle"
      aria-hidden="true"
    />
  );

  return (
    <div className="bg-background border-border sticky top-0 z-50 border-b">
      <div className="flex items-center gap-1 px-2 py-2">
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
    </div>
  );
};

export default MenuBar;
