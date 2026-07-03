"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bold, Italic, UnderlineIcon, Strikethrough, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Undo, Redo, Quote } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn("flex size-8 items-center justify-center rounded-lg transition-colors", active ? "bg-sunrise-amber text-navy" : "text-navy/50 hover:bg-navy/5 hover:text-navy")}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder = "Nội dung bài viết..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Placeholder.configure({ placeholder }), Link.configure({ openOnClick: false }), TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[320px] px-4 py-3 text-sm text-navy leading-relaxed focus:outline-none",
      },
    },
  });

  // Sync value từ ngoài vào (khi load data từ API)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("Nhập URL:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
    else editor?.chain().focus().unsetLink().run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-navy/15 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-navy/10 px-3 py-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-navy/10" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-navy/10" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Danh sách">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Danh sách số">
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Trích dẫn">
          <Quote size={14} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-navy/10" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Căn trái">
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Căn giữa">
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Căn phải">
          <AlignRight size={14} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-navy/10" />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Chèn link">
          <LinkIcon size={14} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-navy/10" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
