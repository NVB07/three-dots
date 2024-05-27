"use client";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentItem from "./CommentItem";

const Comment = ({ currentUser }) => {
    const [commentValue, setCommentValue] = useState("");
    const [commentArray, setCommentArray] = useState([]);
    const textareaRef = useRef(null);

    const handleInputText = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
        setCommentValue(e.target.value);
    };
    return (
        <div className="w-full pt-2">
            <div className="w-full flex items-start px-3 pb-3">
                <div className="w-12 pt-0.5">
                    <Avatar className="w-9  h-9 ">
                        <AvatarImage src={currentUser?.photoURL} alt="@shadcn" />
                        <AvatarFallback>TD</AvatarFallback>
                    </Avatar>
                </div>
                <Textarea
                    rows={1}
                    ref={textareaRef}
                    value={commentValue}
                    onChange={handleInputText}
                    placeholder="Bình luận"
                    className="outline-none rounded-2xl resize-none h-10 min-h-10 max-h-64 text-base bg-[hsl(var(--foreground)/5%)]"
                />
            </div>
            <div>
                <CommentItem />
            </div>
        </div>
    );
};

export default Comment;
