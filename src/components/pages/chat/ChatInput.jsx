"use client";
import { useState, useRef, useEffect } from "react";
import { addSubDocument, sendMessage } from "@/firebase/services";
import { Button } from "@/components/ui/button";
import ShareIcon from "@/components/icons/ShareIcon";
import { Textarea } from "@/components/ui/textarea";

const ChatInput = ({ documentId, currentUserData, messageData, scrollRef }) => {
    const [message, setMessage] = useState("");
    const [scroll, setScroll] = useState(false);
    const textareaRef = useRef(null);

    let firstScroll = messageData.length < 10;
    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;

        // scrollToBottom();
        // const timeoutId = setTimeout(scrollToBottom, 2000);
        // return () => clearTimeout(timeoutId);
    }, [firstScroll]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
            // scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight <= 20;
            setScroll(isNearBottom);
        }
    };

    useEffect(() => {
        const scrollRefCurrent = scrollRef.current;
        if (scrollRefCurrent) {
            scrollRefCurrent.addEventListener("scroll", handleScroll);
            return () => {
                if (scrollRefCurrent) {
                    scrollRefCurrent.removeEventListener("scroll", handleScroll);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (scroll) scrollToBottom();
    }, [messageData]);

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
                setScroll(true);
            }
        }
    };
    const handleSendMessage = () => {
        const formattedMessage = message.trim().replace(/\n/g, "|~n|");
        sendMessage(documentId, {
            content: formattedMessage,
            uid: currentUserData.uid,
        });
        setMessage("");
        textareaRef.current.style.height = "40px";
    };
    return (
        <div className="sticky  bottom-0 z-20 bg-background pl-3 h-fit pt-2 pb-1 ">
            <div className="flex pr-0.5 items-center w-full border-border border-2 overflow-hidden  rounded-3xl">
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
                    <Button
                        onClick={handleSendMessage}
                        variant="ghost"
                        size="icon"
                        className="rounded-full max-w-9 max-h-9 w-full h-full min-w-9 min-h-9  bg-[#0042f6] sm:hover:bg-[#0087f6] rotate-[25deg]"
                    >
                        <ShareIcon color="#ffffff" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ChatInput;
