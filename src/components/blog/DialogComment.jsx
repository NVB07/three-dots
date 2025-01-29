"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import HeartIcon from "../icons/HeartIcon";
import ShareIcon from "../icons/ShareIcon";
import CountReact from "./CountReact";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import CommentItem from "../pages/comment/CommentItem";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { fireStore } from "@/firebase/config";
import { addSubDocument } from "@/firebase/services";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
const DialogComment = ({ thisBlogData, authorData, authCurrentUser, likePost, imageLoader, blogid, handleLikePost, handleCopyLink, children }) => {
    const [commentValue, setCommentValue] = useState("");
    const [commentArray, setCommentArray] = useState([]);
    const textareaRef = useRef(null);
    const handleInputText = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
        setCommentValue(e.target.value);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (commentValue.trim()) {
                handleSendComment();
            }
        }
    };
    const handleConvertDate = (timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();

            const time = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes} | ${day < 10 ? "0" + day : day}/${
                month < 10 ? "0" + month : month
            }/${year}`;

            return time;
        }
        return "?";
    };
    const handleSendComment = () => {
        const formattedComment = commentValue.trim().replace(/\n/g, "|~n|");
        addSubDocument("blogs", blogid, "comments", {
            comment: formattedComment,
            uid: authCurrentUser?.uid,
            displayName: authCurrentUser?.displayName,
            photoURL: authCurrentUser?.photoURL,
        });
        setCommentValue("");
        textareaRef.current.style.height = "40px";
    };
    useEffect(() => {
        const q = query(collection(fireStore, "blogs", blogid, "comments"), orderBy("sendTime", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                const doc = change.doc;
                const commentData = { data: doc.data(), id: doc.id };

                switch (change.type) {
                    case "added":
                        setCommentArray((prev) => [commentData, ...prev]);
                        break;
                    case "modified":
                        setCommentArray((prev) => prev.map((post) => (post.id === doc.id ? commentData : post)));
                        break;
                    case "removed":
                        setCommentArray((prev) => prev.filter((post) => post.id !== doc.id));
                        break;
                    default:
                        break;
                }
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>{children}</div>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[620px] h-[calc(100vh-100px)] md:h-[calc(100vh-20px)] md:max-h-[calc(100vh-20px)] p-0.5 flex flex-col justify-between">
                <DialogHeader>
                    <DialogTitle className="p-6 pt-3 pb-0 text-base">Bài viết của {authorData?.displayName}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full h-[calc(100vh-86px)] px-6">
                    <div className="flex items-start">
                        <div className="min-w-12 w-12 max-w-12 flex flex-col">
                            <Link href={"/user/@" + authorData?.uid}>
                                <div className="{style.modalCard}">
                                    {authorData?.photoURL ? (
                                        <Image
                                            src={authorData?.photoURL}
                                            width={36}
                                            height={36}
                                            alt={"Ảnh đại diện của " + authorData?.displayName}
                                            className="w-9 h-9 rounded-full "
                                        />
                                    ) : (
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                    )}
                                </div>
                            </Link>
                        </div>
                        <div className="w-full flex justify-between mb-1.5">
                            <div className=" flex flex-col items-start">
                                <Link href={"/user/@" + authorData?.uid} className="font-semibold hover:underline mb-0">
                                    {authorData?.displayName}
                                </Link>
                                <div className="text-[#acacac] text-xs ">{thisBlogData?.createAt ? handleConvertDate(thisBlogData?.createAt) : "..."}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-2 text-[15px] ">
                        <div
                            style={{ wordBreak: "break-word" }}
                            className="break-words max-w-full list-custom-text"
                            dangerouslySetInnerHTML={{ __html: thisBlogData?.post.content }}
                        />
                    </div>
                    <div className="w-fit">
                        {thisBlogData?.post.imageURL ? (
                            <Image
                                loader={imageLoader}
                                priority
                                style={{ width: "auto", height: "auto" }}
                                src={thisBlogData?.post.imageURL}
                                width={600}
                                height={300}
                                alt="image"
                                blurDataURL="/blur.png"
                                placeholder="blur"
                                className="rounded"
                            />
                        ) : null}
                    </div>
                    <div className="mt-2.5 flex items-center">
                        <div className="w-9 h-9 mr-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1.5"
                                onClick={handleLikePost}
                            >
                                {likePost ? <HeartIcon solidColor="red" /> : <HeartIcon />}
                            </Button>
                        </div>
                        <div className="w-9 h-9 mr-1">
                            <Button
                                variant="ghost"
                                onClick={handleCopyLink}
                                size="icon"
                                className="flex items-center justify-center rounded-full w-full h-full bg-transparent text-2xl p-1"
                            >
                                <ShareIcon />
                            </Button>
                        </div>
                    </div>
                    <CountReact blogid={blogid} like={thisBlogData?.liked?.length || 0} openDialog />
                    <div className="w-full h-fit border-t border-border mt-3 pt-2">
                        {commentArray.map((data) => {
                            return (
                                <CommentItem
                                    currentUser={authCurrentUser}
                                    key={data.id}
                                    commentId={data?.id}
                                    blogId={blogid}
                                    content={data?.data.comment}
                                    displayName={data?.data.displayName}
                                    time={handleConvertDate(data?.data.sendTime)}
                                    photoURL={data?.data.photoURL}
                                    uid={data?.data.uid}
                                />
                            );
                        })}
                    </div>
                </ScrollArea>
                <DialogFooter className={"h-fit "}>
                    <div className="w-full flex items-start px-3 pb-3">
                        <div className="w-12 pt-0.5">
                            <Avatar className="w-9  h-9 ">
                                <AvatarImage src={authCurrentUser?.photoURL} alt="@shadcn" />
                                <AvatarFallback>TD</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex relative flex-1 rounded-2xl bg-[hsl(var(--foreground)/5%)]">
                            <Textarea
                                rows={1}
                                ref={textareaRef}
                                value={commentValue}
                                onChange={handleInputText}
                                onKeyDown={handleKeyDown}
                                placeholder="Bình luận"
                                className="outline-none rounded-2xl resize-none h-10 min-h-10 max-h-20 text-base bg-transparent pr-10"
                            />
                            {commentValue.trim() ? (
                                <button
                                    onClick={handleSendComment}
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full w-7 h-7 hover:bg-transparent absolute right-2 bottom-1/2 translate-y-1/2 rotate-[25deg]"
                                >
                                    <ShareIcon color="#0095f6" />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DialogComment;
