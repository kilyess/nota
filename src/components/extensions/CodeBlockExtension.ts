import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { all, createLowlight } from "lowlight";
import { CodeBlockComponent } from "./CodeBlockWithCopy";

const lowlight = createLowlight(all);

export const CodeBlockExtension = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        if (editor.isActive("codeBlock")) {
          return editor.commands.insertContent("\t");
        }
        return false;
      },
      "Shift-Tab": ({ editor }) => {
        if (editor.isActive("codeBlock")) {
          const { from, to } = editor.state.selection;
          const text = editor.state.doc.textBetween(from, to);
          if (text.startsWith("\t")) {
            editor.commands.deleteRange({ from, to: from + 1 });
            return true;
          }
        }
        return false;
      },
    };
  },
}).configure({
  lowlight,
  HTMLAttributes: {
    class: "hljs",
  },
});
