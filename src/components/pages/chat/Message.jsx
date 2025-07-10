"use client";
import { Fragment, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NodeRSA from "node-rsa";
import aesjs from "aes-js";
import sha256 from "js-sha256";
import Image from "next/image";

const Message = ({ rsaKey, data, myMessage = false, photoURL }) => {
    const [decryptMessage, setDecryptMessage] = useState("");
    const [loading, setLoading] = useState(true);
    // console.log(data);
    const getSha256Bytes = (text) => {
        const hashHex = sha256(text);
        const bytes = [];
        for (let i = 0; i < hashHex.length; i += 2) {
            bytes.push(parseInt(hashHex.substr(i, 2), 16));
        }
        return Uint8Array.from(bytes);
    };

    const decryptKeyAesWithRsa = () => {
        try {
            const key = new NodeRSA(rsaKey);
            key.setOptions({ encryptionScheme: "pkcs1" });
            if (myMessage) {
                const encryptedBuffer = Buffer.from(data?.aesKeySenderEncrypted, "base64");
                const decrypted = key.decrypt(encryptedBuffer, "utf8");
                return decrypted;
            } else {
                const encryptedBuffer = Buffer.from(data?.aesKeyReceiverEncrypted, "base64");
                const decrypted = key.decrypt(encryptedBuffer, "utf8");
                return decrypted;
            }
        } catch (error) {
            console.error("Lỗi khi giải mã tin nhắn", error);
            return null;
        }
    };

    const decryptMessageWithAes = () => {
        try {
            const aesKeyString = decryptKeyAesWithRsa();
            const encryptedBytes = Uint8Array.from(atob(data?.content), (c) => c.charCodeAt(0));
            const keyBytes = aesjs.utils.hex.toBytes(aesKeyString);
            const ivBytes = aesjs.utils.hex.toBytes(data?.iv);
            const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            const decryptedBytes = aesCbc.decrypt(encryptedBytes);
            const unpadded = aesjs.padding.pkcs7.strip(decryptedBytes);
            const decryptedText = aesjs.utils.utf8.fromBytes(unpadded);
            setDecryptMessage(decryptedText);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setDecryptMessage(null);
        }
    };

    useEffect(() => {
        const runDecrypt = () => {
            decryptMessageWithAes();
        };

        runDecrypt();
    }, []);
    if (decryptMessage === null || decryptMessage === "") return null;
    const parts = decryptMessage.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));
    return (
        <div className={`flex items-end my-3 mr-4 ${myMessage ? "flex-row-reverse" : "justify-start"}`}>
            {loading ? (
                <>
                    {!myMessage && <Skeleton className={"w-7 h-7 rounded-full"} />}
                    <Skeleton className={"w-1/2 h-7 ml-1.5 rounded-2xl"} />
                </>
            ) : (
                <>
                    {!myMessage ? (
                        <Image
                            src={photoURL || "/avatarDefault.svg"}
                            alt="@shadcn"
                            width={28}
                            height={28}
                            className="rounded-full w-7 h-7 max-h-7 max-w-7 object-cover"
                        />
                    ) : null}
                    <div className={`ml-1.5  max-w-[75%] ${myMessage ? "bg-[#3797f0] text-white content-end " : "bg-accent"}   py-1 px-2.5 rounded-2xl `}>
                        <p style={{ wordBreak: "break-word" }} className=" break-words   max-w-full text-[15px]">
                            {elements}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Message;
