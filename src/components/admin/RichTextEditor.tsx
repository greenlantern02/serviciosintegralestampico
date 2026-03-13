"use client";

import { useRef } from "react";
import { Bold, Italic, List, ListOrdered, Heading3 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (json: string) => void;
}

type LexicalText = { type: "text"; text: string; format?: number };
type LexicalNode =
  | { type: "paragraph"; children: LexicalText[] }
  | { type: "heading"; tag: string; children: LexicalText[] }
  | { type: "list"; listType: "bullet" | "number"; children: Array<{ type: "listitem"; children: LexicalText[] }> };

function toJson(nodes: LexicalNode[]): string {
  return JSON.stringify({ root: { children: nodes, type: "root", version: 1 } });
}

function parseOrEmpty(value: string): LexicalNode[] {
  try {
    const parsed = JSON.parse(value);
    return parsed?.root?.children ?? [];
  } catch {
    return [];
  }
}

function nodesToText(nodes: LexicalNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === "paragraph" || n.type === "heading") {
        return n.children.map((c) => c.text).join("");
      }
      if (n.type === "list") {
        return n.children.map((li) => "• " + li.children.map((c) => c.text).join("")).join("\n");
      }
      return "";
    })
    .join("\n\n");
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const plainText = nodesToText(parseOrEmpty(value));

  function handleChange(text: string) {
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    const nodes: LexicalNode[] = paragraphs.map((p) => ({
      type: "paragraph",
      children: [{ type: "text", text: p.replace(/\n/g, " ") }],
    }));
    onChange(toJson(nodes));
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <div className="flex gap-1 px-2 py-2 bg-white/5 border-b border-white/10">
        {[Bold, Italic, Heading3, List, ListOrdered].map((Icon, i) => (
          <button
            key={i}
            type="button"
            className="p-1.5 text-white/30 hover:text-white/70 rounded hover:bg-white/10 transition-colors"
            title="Formato (próximamente)"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <span className="ml-2 text-white/20 text-xs self-center">Texto plano — formato en desarrollo</span>
      </div>
      <textarea
        ref={ref}
        defaultValue={plainText}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        className="w-full bg-transparent px-4 py-3 text-white text-sm resize-y focus:outline-none placeholder-white/20"
        placeholder="Descripción completa del producto. Separe párrafos con una línea en blanco."
      />
    </div>
  );
}
