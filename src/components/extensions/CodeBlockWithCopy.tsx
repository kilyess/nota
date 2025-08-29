"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

import type { NodeViewProps } from "@tiptap/react";

export function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent);
      toast.success("Code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <NodeViewWrapper className="relative">
      <div className="bg-muted border-border relative rounded-lg border">
        <div className="border-border flex items-center justify-between border-b px-4 py-2">
          <span className="text-muted-foreground font-mono text-sm">
            {node.attrs.language || "code"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 px-2 text-xs"
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy
          </Button>
        </div>
        <pre className="overflow-x-auto p-4">
          <NodeViewContent className="font-mono text-sm" />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
