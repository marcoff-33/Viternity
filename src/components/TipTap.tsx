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
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import {
  Editor,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { server_uploadHTML } from "@/app/utils/serverActions";

const buttonStyles =
  "hover:bg-muted transition-all px-3 py-2 rounded-md duration-300 text-center items-center";

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex bg-background flex-wrap p-1 gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${buttonStyles} ${
          editor.isActive("bold")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdFormatBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${buttonStyles} ${
          editor.isActive("italic")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdFormatItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${buttonStyles} ${
          editor.isActive("strike")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdOutlineStrikethroughS />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`${buttonStyles} ${
          editor.isActive("code")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdOutlineCode />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={buttonStyles}
      >
        <MdOutlineClearAll />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <PiParagraphLight />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 1 })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <LuHeading1 size={25} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 2 })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <LuHeading2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 3 })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <LuHeading3 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${buttonStyles} ${
          editor.isActive("heading", { level: 4 })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <LuHeading4 size={17} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonStyles} ${
          editor.isActive("bulletList")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdFormatListBulleted />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${buttonStyles} ${
          editor.isActive("codeBlock")
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <BiCodeBlock />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "left" }) ||
          editor.isActive("heading", { textAlign: "left" })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdOutlineFormatAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "center" }) ||
          editor.isActive("heading", { textAlign: "center" })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdOutlineFormatAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${buttonStyles} ${
          editor.isActive("paragraph", { textAlign: "right" }) ||
          editor.isActive("heading", { textAlign: "right" })
            ? "is-active bg-muted"
            : "hover:text-accent-foreground/20"
        }`}
      >
        <MdOutlineFormatAlignRight />
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
  authorId,
  userId,
}: {
  editable: boolean;
  vaultText: string;
  vaultId: string;
  authorId: string;
  userId: string;
}) => {
  const [content, setContent] = useState(vaultText); // Initial HTML

  const editor = useEditor({
    content: content,
    editable,
    extensions,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="">
      {editable && authorId == userId && <MenuBar editor={editor!} />}
      <div
        className={`text-primary-foreground ${
          editable && "border-red-500 border-[2px] animate-pulse"
        }`}
      >
        <EditorContent
          content={content}
          editor={editor}
          readOnly={!editable}
          aria-readonly={!editable}
        />
      </div>
      {editable && authorId == userId && (
        <Button
          onClick={() => server_uploadHTML(content, vaultId)}
          className="sticky bottom-10 shadow-lg w-full my-10"
        >
          Save Text
        </Button>
      )}
    </div>
  );
};

export default TextEditor;
