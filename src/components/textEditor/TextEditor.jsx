"use client";
import "./textEditCustomStyle.css";

import { BoldIcon, HighlightColorIcon, ItalicIcon, UnderLineIcon, TextColorIcon, ListDotsIcon, ListNumberIcon } from "../icons/TextEditorIcons";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import History from "@tiptap/extension-history";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import OrderedList from "@tiptap/extension-ordered-list";
import { Globe, Users } from "lucide-react";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const TextEditor = ({ setContent, content, setPlainText, privacyValue, setPrivacyValue }) => {
    const editor = useEditor({
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
            setPlainText(editor.getText());
        },
        extensions: [
            Document,
            Paragraph,
            BulletList,
            OrderedList,
            ListItem,
            Text,
            Bold,
            Italic,
            Underline,
            TextStyle,
            History,
            Color,
            Placeholder.configure({
                placeholder: "Viết trạng thái ...",
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["ftp", "mailto", "https"],
                HTMLAttributes: {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "text-[#5aa7ff] hover:underline",
                },
            }),
            Highlight.configure({ multicolor: false }),
        ],
        content: content,
    });
    if (!editor) {
        return null;
    }
    const handleToggleTextColor = () => {
        if (editor.isActive("textStyle", { color: "red" })) editor.chain().focus().unsetColor().run();
        else editor.chain().focus().setColor("red").run();
    };

    return (
        <div>
            <div className="flex items-start gap-2 justify-between ">
                <div>
                    <Select value={privacyValue} onValueChange={setPrivacyValue}>
                        <SelectTrigger className=" flex items-center gap-2 border-border">
                            {privacyValue === "public" && <Globe width={18} height={18} />}
                            {privacyValue === "friend" && <Users width={18} height={18} />}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public" className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Globe width={18} height={18} /> Công khai
                                </div>
                            </SelectItem>
                            <SelectItem value="friend" className="flex items-center ">
                                <div className="flex items-center gap-2">
                                    <Users width={18} height={18} /> Người theo dõi
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-0.5 items-center mb-1">
                    <Button variant="outline" className="w-8 h-8 min-w-8 p-1.5 border-border" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <BoldIcon color={editor.isActive("bold") ? "#007bff" : "currentColor"} />
                    </Button>
                    <Button variant="outline" className="w-8 h-8 min-w-8 p-1.5 border-border" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <ItalicIcon color={editor.isActive("italic") ? "#007bff" : "currentColor"} />
                    </Button>
                    <Button variant="outline" className="w-8 h-8 min-w-8 p-1.5 border-border" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        <UnderLineIcon color={editor.isActive("underline") ? "#007bff" : "currentColor"} />
                    </Button>
                    <Button variant="ghost" className="w-8 h-8 min-w-8 p-0" onClick={() => editor.chain().focus().toggleHighlight().run()}>
                        <HighlightColorIcon color={editor.isActive("highlight") ? "#ffc107" : "currentColor"} />
                    </Button>
                    <Button variant="ghost" className="w-8 h-8 min-w-8 p-2" onClick={handleToggleTextColor}>
                        <TextColorIcon color={editor.isActive("textStyle", { color: "red" }) ? "red" : "currentColor"} />
                    </Button>
                    <Button variant="ghost" className="w-8 h-8 min-w-8 p-0" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                        <ListDotsIcon color={editor.isActive("bulletList") ? "#007bff" : "currentColor"} />
                    </Button>
                    <Button variant="ghost" className="w-8 h-8 min-w-8 p-0" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                        <ListNumberIcon color={editor.isActive("orderedList") ? "#007bff" : "currentColor"} />
                    </Button>
                </div>
            </div>
            <EditorContent className=" *:border-none *:outline-none bg-[hsl(var(--foreground)/5%)] min-h-20 max-h-64 h-fit list-custom-text rounded-md" editor={editor} />
        </div>
    );
};

export default TextEditor;
