"use client";
import { Fragment, useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OptionIcon from "@/components/icons/OptionIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import TrashIcon from "@/components/icons/TrashIcon";

import { deleteSubDocument } from "@/firebase/services";
import { AuthContext } from "@/auth/AuthProvider";

const CommentItem = ({ content = "", displayName = "", photoURL = "", uid = "", time = "", commentId = "", blogId = "", currentUser }) => {
    const authUserData = useContext(AuthContext);

    const parts = content.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));

    const handleDeleteComment = async () => {
        await deleteSubDocument("blogs", blogId, "interact", commentId)
            .then(() => {
                toast("Đã xóa bình luận", {
                    cancel: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                    icon: <TrashIcon />,
                });
            })
            .catch((err) => {
                toast.error("Lỗi khi xóa bình luận", {
                    action: {
                        label: <CloseIcon />,
                        onClick: () => {},
                    },
                });
            });
    };

    return (
        <div className="h-fit w-full px-3 py-2 flex items-start">
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
                <p style={{ wordBreak: "break-word" }} className="pb-1 text-sm ">
                    {elements}
                </p>
                <p className="text-xs font-light text-[#acacac] ">{time}</p>
            </div>
            {currentUser.uid === uid && (
                <div className="h-full p-1 flex items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full w-7 h-7">
                                <OptionIcon width={16} height={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full flex flex-col p-0">
                            <Button onClick={handleDeleteComment} variant="ghost" className="text-[#f14b5c] hover:text-[#f14b5c]">
                                Xóa bình luận
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
};

export default CommentItem;
