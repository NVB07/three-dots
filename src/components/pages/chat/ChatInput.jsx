"use client";
import { useState, useRef, useEffect } from "react";
import { addSubDocument, sendMessage } from "@/firebase/services";
import { Button } from "@/components/ui/button";
import ShareIcon from "@/components/icons/ShareIcon";
import { Textarea } from "@/components/ui/textarea";
import NodeRSA from "node-rsa";
import aesjs from "aes-js";
import { toast } from "sonner";

const ChatInput = ({ documentId, currentUserData, messageData, scrollRef, friendData }) => {
    const [message, setMessage] = useState("");
    const [scroll, setScroll] = useState(false);
    const textareaRef = useRef(null);

    let firstScroll = messageData.length < 10;
    useEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [firstScroll]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
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

    // Sinh AES key random (32 bytes cho AES-256) - trả về hex string như native
    const generateAESKey = () => {
        const key = new Uint8Array(32);
        window.crypto.getRandomValues(key);
        // Chuyển thành hex string như native app
        return uint8ArrayToHex(key);
    };

    // Sinh IV random (16 bytes)
    const generateIV = () => {
        const iv = new Uint8Array(16);
        window.crypto.getRandomValues(iv);
        return iv;
    };

    // Mã hóa message bằng AES-256-CBC
    const encryptAES = (text, keyHex, ivBytes) => {
        try {
            const textBytes = aesjs.utils.utf8.toBytes(text);
            const padded = aesjs.padding.pkcs7.pad(textBytes);
            const keyBytes = aesjs.utils.hex.toBytes(keyHex); // Chuyển hex thành bytes
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            const encryptedBytes = aesCbc.encrypt(padded);
            return encryptedBytes;
        } catch (error) {
            console.error("Lỗi mã hóa AES:", error);
            throw error;
        }
    };

    // Mã hóa AES key bằng RSA public key
    const encryptRSA = (dataHex, publicKeyPem) => {
        try {
            const key = new NodeRSA(publicKeyPem);
            key.setOptions({
                encryptionScheme: "pkcs1", // Giữ nguyên pkcs1 như native
            });

            // Mã hóa hex string trực tiếp như native
            const encrypted = key.encrypt(dataHex, "base64");
            return encrypted;
        } catch (error) {
            console.error("Lỗi mã hóa RSA:", error);
            throw error;
        }
    };

    const uint8ArrayToHex = (uint8Array) => {
        return Array.from(uint8Array)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };

    const handleSendMessage = async () => {
        if (!friendData?.publicKey || !currentUserData?.publicKey) {
            alert("Chưa có khóa công khai!");
            return;
        }

        if (!message.trim()) {
            return;
        }

        try {
            const AESKeyHex = generateAESKey();
            const iv = generateIV();
            setMessage("");
            const encryptedBytes = encryptAES(message, AESKeyHex, iv);
            const cipher = btoa(String.fromCharCode(...encryptedBytes));
            const aesKeyReceiverEncrypted = encryptRSA(AESKeyHex, friendData.publicKey);
            const aesKeySenderEncrypted = encryptRSA(AESKeyHex, currentUserData.publicKey);
            const messageData = {
                content: cipher,
                uid: currentUserData.uid,
                aesKeyReceiverEncrypted,
                aesKeySenderEncrypted,
                iv: uint8ArrayToHex(iv),
            };
            await sendMessage(documentId, messageData);

            if (textareaRef.current) {
                textareaRef.current.style.height = "40px";
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            toast.error("Có lỗi xảy ra khi gửi tin nhắn!");
        }
    };

    return (
        <div className="sticky bottom-0 z-20 bg-background pl-3 h-fit pt-2 pb-1">
            <div className="flex pr-0.5 items-center w-full border-border border-2 overflow-hidden rounded-3xl">
                <Textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={handleInput}
                    type="text"
                    placeholder="Nhắn tin..."
                    className="outline-none rounded-2xl resize-none h-10 min-h-10 max-h-20 text-base"
                />
                {message.trim() ? (
                    <Button
                        onClick={handleSendMessage}
                        variant="ghost"
                        size="icon"
                        className="rounded-full max-w-9 max-h-9 w-full h-full min-w-9 min-h-9 bg-[#0042f6] sm:hover:bg-[#0087f6] rotate-[25deg]"
                    >
                        <ShareIcon color="#ffffff" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ChatInput;
