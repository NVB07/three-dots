"use client";
import { Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
const CommentItem = ({ content = "", displayName = "", photoURL = "", uid = "", time = "" }) => {
    const parts = content.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));
    return (
        <div className="h-fit w-full  px-3 py-2 flex items-start">
            <div className="mr-2">
                <Link href={"/user/@" + uid}>
                    <Avatar className="w-8 h-8 ">
                        <AvatarImage src={photoURL} alt={displayName} />
                        <AvatarFallback>X</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
            <div className="flex flex-col justify-start bg-[hsl(var(--foreground)/5%)] p-3 py-1  rounded-2xl">
                <Link href={"/user/@" + uid} className="hover:underline text-sm font-semibold">
                    {displayName}
                </Link>
                <p className="pb-1 text-sm font-light">{elements}</p>
                <p className="text-xs font-light text-[#acacac] ">{time}</p>
            </div>
        </div>
    );
};

export default CommentItem;
