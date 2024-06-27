"use client";
// PLACEHOLDER TEXT EDITOR
import { Color } from "@tiptap/extension-color";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdOutlineClearAll,
  MdOutlineCode,
  MdOutlineFormatAlignCenter,
  MdOutlineFormatAlignLeft,
  MdOutlineFormatAlignRight,
  MdOutlineStrikethroughS,
} from "react-icons/md";
import { PiParagraphLight } from "react-icons/pi";
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4 } from "react-icons/lu";
import { BiCodeBlock } from "react-icons/bi";
import TextAlign from "@tiptap/extension-text-align";

import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { server_uploadHTML } from "@/app/utils/serverActions";
import { set } from "zod";

const buttonStyles =
  "hover:bg-muted/80 border transition-all px-3 py-2 rounded-md duration-300 text-center items-center";

const MenuBar = ({
  editor,
  content,
  vaultId,
  allowSave,
  setAllowSave,
}: {
  editor: Editor;
  content: string;
  vaultId: string;
  allowSave: boolean;
  setAllowSave: (value: boolean) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  if (!editor) {
    return null;
  }

  const handleSave = async () => {
    setIsProcessing(true);
    await server_uploadHTML(content, vaultId);
    setAllowSave(false);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-wrap p-1 gap-5 pb-5">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${buttonStyles} ${
          editor.isActive("bold")
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdFormatBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${buttonStyles} ${
          editor.isActive("italic")
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdFormatItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${buttonStyles} ${
          editor.isActive("strike")
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdOutlineStrikethroughS />
      </button>

      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph")
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <PiParagraphLight />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 1 })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <LuHeading1 size={25} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 2 })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <LuHeading2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 3 })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <LuHeading3 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 4 })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <LuHeading4 size={17} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonStyles} ${
          editor.isActive("bulletList")
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdFormatListBulleted />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "left" }) ||
          editor.isActive("heading", { textAlign: "left" })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdOutlineFormatAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "center" }) ||
          editor.isActive("heading", { textAlign: "center" })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdOutlineFormatAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "right" }) ||
          editor.isActive("heading", { textAlign: "right" })
            ? "is-active bg-card border-border text-card-foreground"
            : "hover:text-accent-foreground/20 text-card-foreground border-transparent"
        }`}
      >
        <MdOutlineFormatAlignRight />
      </button>
      <button
        onClick={handleSave}
        disabled={!allowSave}
        className={`${
          !allowSave
            ? "bg-muted/50 text-muted"
            : "bg-primary text-primary-foreground"!
        } rounded-full font-bold px-5 transition-colors duration-200 w-[200px]`}
      >
        <p className="min-w-full">{isProcessing ? "Saving..." : "Save Text"}</p>
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];
const TextEditor = ({
  editable,
  vaultText,
  vaultId,
}: {
  editable: boolean;
  vaultText: string;
  vaultId: string;
}) => {
  const [content, setContent] = useState(vaultText); // Initial HTML

  const [allowSave, setAllowSave] = useState(false);

  const editor = useEditor({
    content: content,
    editable,
    extensions,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      if (!allowSave) setAllowSave(true);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(vaultText);
      console.log("set content", editor);
    }
  }, [vaultText, editor]);

  return (
    <div className="text-foreground">
      {editable && (
        <MenuBar
          content={content}
          editor={editor!}
          vaultId={vaultId}
          allowSave={allowSave}
          setAllowSave={setAllowSave}
        />
      )}
      <div
        className={`text-foreground outline-none bg-card border border-border rounded-lg p-5 ${
          editable && ""
        }`}
      >
        <EditorContent
          content={content}
          editor={editor}
          readOnly={!editable}
          aria-readonly={!editable}
          className=""
        />
      </div>
    </div>
  );
};

export default TextEditor;
