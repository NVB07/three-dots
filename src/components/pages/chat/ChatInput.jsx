"use client";
import { useState, useRef } from "react";
import { addSubDocument } from "@/firebase/services";
import { Button } from "@/components/ui/button";
import ShareIcon from "@/components/icons/ShareIcon";
import { Textarea } from "@/components/ui/textarea";

const ChatInput = ({ documentId, currentUserData }) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";

        setMessage(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
                handleSendMessage();
            }
        }
    };
    const handleSendMessage = () => {
        const formattedMessage = message.trim().replace(/\n/g, "|~n|");
        addSubDocument("roomsChat", documentId, "chat", {
            content: formattedMessage,
            uid: currentUserData.uid,
        });
        setMessage("");
        textareaRef.current.style.height = "40px";
    };
    return (
        <div className="sticky  bottom-0 z-20 bg-background pl-3 h-fit pt-2 pb-1 ">
            <div className="flex pr-3 items-center w-full border-border border-2 overflow-hidden  rounded-3xl">
                <Textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={handleInput}
                    type="text"
                    placeholder="Nhắn tin..."
                    className="outline-none rounded-2xl resize-none h-10 min-h-10 max-h-20 text-base "
                />
                {message.trim() ? (
                    <Button onClick={handleSendMessage} variant="ghost" size="icon" className="rounded-full w-7 h-7 hover:bg-transparent rotate-[25deg]">
                        <ShareIcon color="#0095f6" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ChatInput;
