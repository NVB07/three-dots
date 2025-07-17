"use client";
import { Fragment } from "react";

import Image from "next/image";

const Message = ({ message, myMessage = false, photoURL }) => {
    if (!message) return null;

    const parts = message.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));

    return (
        <div className={`flex items-end my-3 mr-4 ${myMessage ? "flex-row-reverse" : "justify-start"}`}>
            {!myMessage ? (
                <Image src={photoURL || "/avatarDefault.svg"} alt="@shadcn" width={28} height={28} className="rounded-full w-7 h-7 max-h-7 max-w-7 object-cover" />
            ) : null}
            <div className={`ml-1.5  max-w-[75%] ${myMessage ? "bg-[#3797f0] text-white content-end " : "bg-accent"}   py-1 px-2.5 rounded-2xl `}>
                <p style={{ wordBreak: "break-word" }} className=" break-words   max-w-full text-[15px]">
                    {elements}
                </p>
            </div>
        </div>
    );
};

export default Message;
