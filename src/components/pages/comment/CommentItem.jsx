"use client";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OptionIcon from "@/components/icons/OptionIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import TrashIcon from "@/components/icons/TrashIcon";

import { deleteSubDocument, snapshotCollection } from "@/firebase/services";

const CommentItem = ({ content = "", uid = "", time = "", commentId = "", blogId = "", currentUser }) => {
    const [userComment, setUserComment] = useState();

    useEffect(() => {
        snapshotCollection("users", uid, (data) => {
            if (data) {
                setUserComment(data);
            }
        });
    }, []);

    const parts = content.split("|~n|");
    const elements = parts.map((part, index) => (
        <Fragment key={index}>
            {part}
            {index < parts.length - 1 && <br />}
        </Fragment>
    ));

    const handleDeleteComment = async () => {
        await deleteSubDocument("blogs", blogId, "comments", commentId)
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
                    {userComment?.photoURL ? (
                        <Image
                            src={userComment.photoURL}
                            width={36}
                            height={36}
                            alt={"Ảnh đại diện của " + userComment.displayName}
                            className="w-9 h-9 rounded-full "
                            quality={50}
                        />
                    ) : (
                        <Skeleton className="h-9 w-9 rounded-full" />
                    )}
                </Link>
            </div>
            <div className="flex flex-col justify-start bg-[hsl(var(--foreground)/5%)] p-3 py-1  rounded-2xl">
                <Link href={"/user/@" + uid} className="hover:underline text-sm font-semibold">
                    {userComment?.displayName}
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
